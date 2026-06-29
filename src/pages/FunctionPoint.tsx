import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
  Box,
  Container,
  Text,
  FormControl,
  Input,
  Button,
  FormLabel,
  Select,
  VStack,
  HStack,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Stack,
  Card,
  CardBody,
  CardHeader,
  FormErrorMessage,
} from '@chakra-ui/react';
import FunctionPointHelpModal from '../components/functionpoint/FunctionPointHelpModal';

type Complexity = 'Baja' | 'Media' | 'Alta';
type FunctionType = 'Entradas' | 'Salidas' | 'Consultas' | 'Archivos' | 'Interfaces';

interface FunctionPointCounts {
  [key: string]: {
    [key: string]: string;
  };
}

interface FunctionPointResult {
  totalPoints: number;
  adjustedPoints: number;
  estimatedLOC: number;
}

const complexityWeights: Record<FunctionType, Record<Complexity, number>> = {
  Entradas: { Baja: 3, Media: 4, Alta: 6 },
  Salidas: { Baja: 4, Media: 5, Alta: 7 },
  Consultas: { Baja: 3, Media: 4, Alta: 6 },
  Archivos: { Baja: 7, Media: 10, Alta: 15 },
  Interfaces: { Baja: 5, Media: 7, Alta: 10 },
};

const ldcValues: Record<string, number> = {
  Default: 1,
  '4GL': 40,
  'Ada 83': 71,
  'Ada 95': 49,
  APL: 32,
  'BASIC - compilado': 91,
  'BASIC - interpretado': 128,
  'BASIC ANSI/Quick/Turbo': 64,
  C: 128,
  'C++': 29,
  Clipper: 19,
  'Cobol ANSI 85': 91,
  'Delphi 1': 29,
  Ensamblador: 119,
  'Ensamblador (Macro)': 213,
  Forth: 64,
  'Fortran 77': 105,
  'FoxPro 2.5': 34,
  Java: 53,
  'Modula 2': 80,
  Oracle: 40,
  'Oracle 2000': 23,
  Paradox: 36,
  Pascal: 91,
  'Pascal Turbo 5': 49,
  'Power Builder': 16,
  Prolog: 64,
  'Visual Basic 3': 32,
  'Visual C++': 34,
  'Visual Cobol': 20,
};

const initialFunctionCounts: FunctionPointCounts = {
  Entradas: { Baja: '', Media: '', Alta: '' },
  Salidas: { Baja: '', Media: '', Alta: '' },
  Consultas: { Baja: '', Media: '', Alta: '' },
  Archivos: { Baja: '', Media: '', Alta: '' },
  Interfaces: { Baja: '', Media: '', Alta: '' },
};

const FunctionPoint: React.FC = () => {
  const [functionCounts, setFunctionCounts] = useState<FunctionPointCounts>(
    initialFunctionCounts
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Default');
  const [adjustmentFactor, setAdjustmentFactor] = useState<string>('1.0');
  const [adjustmentError, setAdjustmentError] = useState<string>('');
  const [result, setResult] = useState<FunctionPointResult | null>(null);
  const [loading, setLoading] = useState(false);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const helpModal = useDisclosure();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: FunctionType,
    complexity: Complexity
  ) => {
    const value = e.target.value;

    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
      setFunctionCounts((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [complexity]: value,
        },
      }));
    }
  };
  
  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setSelectedLanguage(e.target.value);

  const handleAdjustmentFactorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);

    setAdjustmentFactor(value);
    if (value === '' || isNaN(numValue)) {
      setAdjustmentError('Por favor ingresa un valor numérico');
    } else if (numValue < 0.65 || numValue > 1.35) {
      setAdjustmentError('El factor de ajuste debe estar entre 0.65 y 1.35');
    } else {
      setAdjustmentError('');
    }
  };
  
  const calculateFunctionPoints = (): FunctionPointResult => {
    let totalPoints = 0;

    (Object.keys(functionCounts) as FunctionType[]).forEach((type) => {
      (Object.keys(functionCounts[type]) as Complexity[]).forEach((complexity) => {
        const count = Number(functionCounts[type][complexity]) || 0;
        const weight = complexityWeights[type][complexity];
        totalPoints += count * weight;
      });
    });

    const adjFactor = parseFloat(adjustmentFactor) || 1.0;
    const adjustedPoints = totalPoints * adjFactor;

    const ldc = ldcValues[selectedLanguage];
    const estimatedLOC = adjustedPoints * ldc;

    return {
      totalPoints,
      adjustedPoints,
      estimatedLOC,
    };
  };
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const adjFactor = parseFloat(adjustmentFactor);
    if (isNaN(adjFactor) || adjFactor < 0.65 || adjFactor > 1.35) {
      setAdjustmentError('El factor de ajuste debe estar entre 0.65 y 1.35');
      return;
    }

    setLoading(true);
    try {
      const calculationResult = calculateFunctionPoints();
      setResult(calculationResult);

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error calculating function points:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxW="full">
      <Box pt={1} mx={2}>
        <HStack mb={1}>
          <Text fontSize="xl">Function Points</Text>
          <Button colorScheme="blue" variant="outline" size="sm" onClick={helpModal.onOpen}>
            ?
          </Button>
        </HStack>

        <FunctionPointHelpModal isOpen={helpModal.isOpen} onClose={helpModal.onClose} />

        <Container as="form" onSubmit={handleSubmit} maxW="full">
          <VStack spacing={4} align="stretch">
            <Card>
              <CardBody>
                <Stack direction={['column', 'row']} spacing={4}>
                  <FormControl>
                    <FormLabel>Programming Language</FormLabel>
                    <Select value={selectedLanguage} onChange={handleLanguageChange}>
                      {Object.keys(ldcValues).map((language) => (
                        <option key={language} value={language}>
                          {language} {language !== 'Default' ? `(${ldcValues[language]} LOC/FP)` : ''}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isInvalid={!!adjustmentError}>
                    <FormLabel>Factor de Ajuste (0.65 - 1.35)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      value={adjustmentFactor}
                      onChange={handleAdjustmentFactorChange}
                      placeholder="1.0"
                    />
                    <FormErrorMessage>{adjustmentError}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <Text fontWeight="bold">Function Types</Text>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {(Object.keys(functionCounts) as FunctionType[]).map((type) => (
                    <Box key={type}>
                      <Text fontWeight="semibold" mb={2} color="blue.600">
                        {type}
                      </Text>
                      <Table variant="simple" size="sm" borderWidth="1px">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th fontSize="xs">Complexity</Th>
                            <Th fontSize="xs">Count</Th>
                            <Th fontSize="xs">Weight</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {(Object.keys(functionCounts[type]) as Complexity[]).map((complexity) => (
                            <Tr key={complexity}>
                              <Td fontSize="sm">{complexity}</Td>
                              <Td>
                                <Input
                                  type="number"
                                  size="sm"
                                  min="0"
                                  max="999"
                                  value={functionCounts[type][complexity]}
                                  onChange={(e) => handleInputChange(e, type, complexity)}
                                  placeholder="0"
                                />
                              </Td>
                              <Td fontSize="sm" color="gray.600">
                                {complexityWeights[type][complexity]}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Calculating..."
            >
              Calculate Function Points
            </Button>
          </VStack>
        </Container>

        {result && (
          <Box mt={6} ref={resultSectionRef}>
            <Text fontSize="xl" mb={4}>
              Resultados del Cálculo
            </Text>

            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="stretch" spacing={4}>
                    <FormControl>
                      <FormLabel>Puntos de Función sin Ajustar</FormLabel>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold">{result.totalPoints}</Text>
                        <Text fontStyle="italic" color="gray.600">FP</Text>
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Puntos de Función Ajustados</FormLabel>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          {result.adjustedPoints.toFixed(2)}
                        </Text>
                        <Text fontStyle="italic" color="gray.600">FP</Text>
                      </HStack>
                    </FormControl>
                  </VStack>

                  <VStack align="stretch" spacing={4}>
                    <FormControl>
                      <FormLabel>Líneas de Código Estimadas</FormLabel>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold">{Math.round(result.estimatedLOC)}</Text>
                        <Text fontStyle="italic" color="gray.600">LOC</Text>
                      </HStack>
                    </FormControl>
                  </VStack>
                </SimpleGrid>

                <Box mt={6} p={4} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                  <Text fontWeight="bold" color="green.800" mb={2}>
                    Resumen
                  </Text>
                  <Text color="green.700">
                    Basado en {result.totalPoints} puntos de función sin ajustar con un factor de ajuste de {adjustmentFactor}, 
                    el tamaño estimado del proyecto es de {result.adjustedPoints.toFixed(2)} puntos de función, 
                    equivalente a aproximadamente {Math.round(result.estimatedLOC)} líneas de código en {selectedLanguage}.
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FunctionPoint;
