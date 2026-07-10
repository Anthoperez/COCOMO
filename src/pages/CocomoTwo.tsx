import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
    Box, Container, Text, FormControl, Input, Button, FormLabel,
    VStack, Stack, Switch, useDisclosure,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    HStack,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
} from "@chakra-ui/react";

import { CocomoTwoOut, CocomoTwoForm } from '../client/models';
import { MethodsService } from '../client/services';
import { downloadEstimationReport } from '../client/pdfReport';
import CostDriver from '../components/common/CostDriver';
import CpmModal from '../components/cocomo/CpmModal';
import { StagePercentages } from '../client/models';

import HelpModal from '../components/cocomoTwo/helpModal';
import EquationsModal from '../components/cocomo/EquationsModal';

const CocomoTwo = () => {
    const [formData, setFormData] = useState<CocomoTwoForm>({
        kdlc: 0,
        cpm: 0,
        costDrivers: [],
        scaleDrivers: [3.72, 3.04, 4.24, 3.29, 4.68] // Valores nominales por defecto
    });
    const [loading, setLoading] = useState(false);
    const [selectedCostDrivers, setSelectedCostDrivers] = useState<{ [key: string]: string }>({});
    const [selectedScaleDrivers, setSelectedScaleDrivers] = useState<{ [key: string]: string }>({});
    const [estimationResult, setEstimationResult] = useState<CocomoTwoOut | null>(null);

    const [isStagesEnabled, setIsStagesEnabled] = useState(false);
    const [showStageResults, setShowStageResults] = useState(false);
    const resultSectionRef = useRef<HTMLDivElement>(null);

    const cpmModal = useDisclosure();
    const helpModal = useDisclosure();
    const equationModal = useDisclosure();

    const [stagePercentages, setStagePercentages] = useState<StagePercentages>({
        requerimientos: 0,
        analisis: 0,
        diseño: 0,
        desarrollo: 0,
        pruebas: 0
    });

    const scaleDrivers = {
        'Factores de Escala': {
            PREC: { VL: 6.20, L: 4.96, N: 3.72, H: 2.48, VH: 1.24, EH: 0.0 },
            FLEX: { VL: 5.07, L: 4.05, N: 3.04, H: 2.03, VH: 1.01, EH: 0.0 },
            RESL: { VL: 7.07, L: 5.65, N: 4.24, H: 2.83, VH: 1.41, EH: 0.0 },
            TEAM: { VL: 4.90, L: 3.92, N: 2.94, H: 1.96, VH: 0.98, EH: 0.0 },
            PMAT: { VL: 7.88, L: 6.30, N: 4.73, H: 3.15, VH: 1.58, EH: 0.0 },
        },
    };    

    const costDrivers = {
        PRODUCTO: {
            RELY: { VL: 0.82, L: 0.92, N: 1.00, H: 1.10, VH: 1.26, EH: null },
            DATA: { VL: null, L: 0.90, N: 1.00, H: 1.14, VH: 1.28, EH: null },
            CPLX: { VL: 0.73, L: 0.87, N: 1.00, H: 1.17, VH: 1.34, EH: 1.74 },
            RUSE: { VL: null, L: 0.95, N: 1.00, H: 1.07, VH: 1.15, EH: 1.24 },
            DOCU: { VL: 0.81, L: 0.91, N: 1.00, H: 1.11, VH: 1.23, EH: null },
        },
        PERSONAL: {
            ACAP: { VL: 1.42, L: 1.19, N: 1.00, H: 0.85, VH: 0.71, EH: null },
            PCAP: { VL: 1.22, L: 1.10, N: 1.00, H: 0.88, VH: 0.81, EH: null },
            PCON: { VL: 1.34, L: 1.15, N: 1.00, H: 0.88, VH: 0.76, EH: null },
            AEXP: { VL: 1.29, L: 1.12, N: 1.00, H: 0.90, VH: 0.81, EH: null },
            PEXP: { VL: 1.19, L: 1.09, N: 1.00, H: 0.91, VH: 0.85, EH: null },
            LTEX: { VL: 1.20, L: 1.09, N: 1.00, H: 0.91, VH: 0.84, EH: null },
        },
        PLATAFORMA: {
            TIME: { VL: null, L: null, N: 1.00, H: 1.11, VH: 1.29, EH: 1.63 },
            STOR: { VL: null, L: null, N: 1.00, H: 1.05, VH: 1.17, EH: 1.46 },
            PVOL: { VL: null, L: 0.87, N: 1.00, H: 1.15, VH: 1.30, EH: null },
        },
        PROYECTO: {
            TOOL: { VL: 1.17, L: 1.09, N: 1.00, H: 0.90, VH: 0.78, EH: null },
            SITE: { VL: 1.22, L: 1.09, N: 1.00, H: 0.93, VH: 0.86, EH: 0.80 },
            SCED: { VL: 1.43, L: 1.14, N: 1.00, H: null, VH: null, EH: null },
        },
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        const parsedValue = id === 'mode' ? value : parseFloat(value);
        setFormData((prevData) => ({ ...prevData, [id]: parsedValue }));
    };

    const handleCostDriverChange = (option: string, value: string) => {
        setSelectedCostDrivers((prev) => {
            const updatedCostDrivers = { ...prev, [option]: value };
            const selectedValuesArray = Object.values(updatedCostDrivers).map(Number);
            setFormData((prevData) => ({
                ...prevData,
                costDrivers: selectedValuesArray,
            }));
            return updatedCostDrivers;
        });
    };

    const handleScaleDriverChange = (option: string, value: string) => {
        setSelectedScaleDrivers((prev) => {
            const updatedScaleDrivers = { ...prev, [option]: value };
            const selectedValuesArray = Object.values(updatedScaleDrivers).map(Number);
            setFormData((prevData) => ({
                ...prevData,
                scaleDrivers: selectedValuesArray,
            }));
            return updatedScaleDrivers;
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = MethodsService.cocomoTwo(formData);
            setEstimationResult(result);
            console.log(result);
            console.log('Selected Cost Drivers Array:', formData.costDrivers);
            console.log('Selected Scale Drivers Array:', formData.scaleDrivers);
             
            // Deslizamiento suave hacia la sección de resultados
            setTimeout(() => {
                resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchChange = () => {
        if (isStagesEnabled) {
            setShowStageResults(false);
            setStagePercentages({
                requerimientos: 0,
                analisis: 0,
                diseño: 0,
                desarrollo: 0,
                pruebas: 0
            });
        } else {
            cpmModal.onOpen();
        }
        setIsStagesEnabled(!isStagesEnabled);
    };

    const handleCpmCalculation = (total: number, percentages: StagePercentages) => {
        console.log('Percentages received:', percentages);
        setFormData((prevData) => ({
            ...prevData,
            cpm: total,
        }));
        setStagePercentages(percentages);
        setShowStageResults(true); 
    };

    const handleModalSubmit = () => {
        setIsStagesEnabled(false);
    };

    const handleDownloadPdf = () => {
        if (!estimationResult) return;

        const costDriverEntries = Object.entries(costDrivers).flatMap(([groupLabel, options]) =>
            Object.entries(options).map(([optionLabel]) => ({
                label: `${groupLabel} - ${optionLabel}`,
                selectedValue: selectedCostDrivers[optionLabel] ?? '',
                factorValue: selectedCostDrivers[optionLabel] ? Number(selectedCostDrivers[optionLabel]) : null,
            }))
        );

        const scaleDriverEntries = Object.entries(scaleDrivers).flatMap(([groupLabel, options]) =>
            Object.entries(options).map(([optionLabel]) => ({
                label: `${groupLabel} - ${optionLabel}`,
                selectedValue: selectedScaleDrivers[optionLabel] ?? '',
                factorValue: selectedScaleDrivers[optionLabel] ? Number(selectedScaleDrivers[optionLabel]) : null,
            }))
        );

        const stageBreakdown = [
            { label: 'Requerimientos', percentage: stagePercentages.requerimientos, cost: estimationResult.costo * stagePercentages.requerimientos },
            { label: 'Análisis', percentage: stagePercentages.analisis, cost: estimationResult.costo * stagePercentages.analisis },
            { label: 'Diseño', percentage: stagePercentages.diseño, cost: estimationResult.costo * stagePercentages.diseño },
            { label: 'Desarrollo', percentage: stagePercentages.desarrollo, cost: estimationResult.costo * stagePercentages.desarrollo },
            { label: 'Pruebas', percentage: stagePercentages.pruebas, cost: estimationResult.costo * stagePercentages.pruebas },
        ];

        downloadEstimationReport({
            title: 'COCOMO II',
            subtitle: 'Reporte de estimación de esfuerzo y costo',
            formData: {
                kdlc: formData.kdlc,
                cpm: formData.cpm,
            },
            estimationResult,
            costDrivers: costDriverEntries,
            scaleDrivers: scaleDriverEntries,
            stageBreakdown: isStagesEnabled || showStageResults ? stageBreakdown : undefined,
            stagesEnabled: isStagesEnabled || showStageResults,
        });
    };

    return (
        <Container maxW="full">
            <Box pt={1} mx={2}>
                <HStack mb={1}>
                    <Text fontSize="xl">COCOMO II</Text>
                    <Button 
                        colorScheme='blue' 
                        variant='outline'
                        size='sm'
                        onClick={helpModal.onOpen}>
                        ?
                    </Button>
                </HStack>
                
                <HelpModal isOpen={helpModal.isOpen} onClose={helpModal.onClose}/>

                <Container as="form" onSubmit={handleSubmit} maxW="full">
                    <VStack spacing={4} align="stretch">
                        
                        {/* Configuration Section */}
                        <Card>
                            <CardBody>
                                <Stack direction={['column', 'row']} spacing={4} align="center">
                                    <FormControl id="kdlc" isRequired>
                                        <FormLabel>KDLC</FormLabel>
                                        <Input
                                            id="kdlc"
                                            placeholder="KDLC"
                                            type="number"
                                            value={formData.kdlc}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl id="cpm" isRequired>
                                        <FormLabel>CPM</FormLabel>
                                        <Input
                                            id="cpm"
                                            placeholder="CPM"
                                            type="number"
                                            value={formData.cpm}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Etapas?</FormLabel>
                                        <Switch 
                                            id='stages' 
                                            onChange={handleSwitchChange} 
                                            isChecked={isStagesEnabled}
                                            colorScheme="blue"
                                        />
                                    </FormControl>
                                </Stack>
                            </CardBody>
                        </Card>

                        {/* Scale Drivers Section */}
                        <Card>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                                    {Object.entries(scaleDrivers).map(([label, options]) => (
                                        <CostDriver
                                            key={label}
                                            label={label}
                                            options={options}
                                            selectedValues={selectedScaleDrivers}
                                            onChange={handleScaleDriverChange}
                                        />
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>

                        {/* Cost Drivers Section */}
                        <Card>
                            <CardHeader>
                                <Text fontWeight="bold">Multiplicadores de Esfuerzo</Text>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {Object.entries(costDrivers).map(([label, options]) => (
                                        <CostDriver
                                            key={label}
                                            label={label}
                                            options={options}
                                            selectedValues={selectedCostDrivers}
                                            onChange={handleCostDriverChange}
                                        />
                                    ))}
                                </SimpleGrid>
                            </CardBody>
                        </Card>


                        <Button 
                            variant="solid" 
                            type="submit" 
                            isLoading={loading} 
                            colorScheme="blue"
                            size="lg"
                            loadingText="Calculando..."
                        >
                            Calcular Estimación
                        </Button>
                    </VStack>
                </Container>

                <CpmModal
                    isOpen={cpmModal.isOpen}
                    onClose={cpmModal.onClose}
                    onCalculate={handleCpmCalculation}
                    onSubmit={handleModalSubmit}
                />

                {estimationResult && (
                    <Box mt={6} ref={resultSectionRef}>
                        <HStack mb={4}>
                            <Text fontSize="xl">Ecuaciones</Text>
                            <Button 
                                colorScheme='teal' 
                                variant='outline'
                                size='sm'
                                onClick={equationModal.onOpen}>
                                ?
                            </Button>
                        </HStack>
                        <EquationsModal isOpen={equationModal.isOpen} onClose={equationModal.onClose} mode={'COCOMO-II'} />

                        <Stack direction={['column', 'row']} justify="space-between" align="center" mb={4}>
                            <Text fontSize="xl">Resultados de la Estimación</Text>
                            <Button colorScheme="purple" variant="outline" onClick={handleDownloadPdf}>
                                Descargar PDF
                            </Button>
                        </Stack>
                        <Card>
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                        <Card>
                                            <CardHeader>
                                                <Text color="blue.600" fontWeight="bold">ESF</Text>
                                            </CardHeader>
                                            <CardBody>
                                                <Text fontSize="xl" fontWeight="bold" color="black">{estimationResult.esf.toFixed(2)}</Text>
                                                <Text fontSize="sm" color="gray.600">Personas-Mes</Text>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <Text color="purple.600" fontWeight="bold">TDES</Text>
                                            </CardHeader>
                                            <CardBody>
                                                <Text fontSize="xl" fontWeight="bold" color="black">{estimationResult.tdes.toFixed(2)}</Text>
                                                <Text fontSize="sm" color="gray.600">Meses</Text>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <Text color="orange.600" fontWeight="bold">Trabajadores</Text>
                                            </CardHeader>
                                            <CardBody>
                                                <Text fontSize="xl" fontWeight="bold" color="black">{estimationResult.n.toFixed(2)}</Text>
                                                <Text fontSize="sm" color="gray.600">Personas</Text>
                                            </CardBody>
                                        </Card>
                                    </SimpleGrid>

                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                        <Card>
                                            <CardHeader>
                                                <Text color="teal.600" fontWeight="bold">Productividad</Text>
                                            </CardHeader>
                                            <CardBody>
                                                <Text fontSize="xl" fontWeight="bold" color="black">{estimationResult.productividad.toFixed(2)}</Text>
                                                <Text fontSize="sm" color="gray.600">KLDC/Personas-Mes</Text>
                                            </CardBody>
                                        </Card>

                                        <Card gridColumn={{ base: 'auto', md: 'span 2' }}>
                                            <CardHeader>
                                                <Text color="green.600" fontWeight="bold">Costo Total</Text>
                                            </CardHeader>
                                            <CardBody>
                                                <Text fontSize="xl" fontWeight="bold" color="black">{estimationResult.costo.toFixed(2)}</Text>
                                                <Text fontSize="sm" color="gray.600">Soles</Text>
                                            </CardBody>
                                        </Card>
                                    </SimpleGrid>

                                    {(isStagesEnabled || showStageResults) && (
                                        <>
                                            {/* <Text mt={4} fontSize="sm" color="gray.600">
                                                Nota: Los costos de etapa son válidos solo para la suma de porcentajes = 100%, 
                                                de lo contrario arrojará resultados inconsistentes.
                                            </Text> */}
                                            <Tabs variant='soft-rounded' colorScheme='blue' isFitted>
                                                <TabList>
                                                    <Tab>Req</Tab>
                                                    <Tab>Ana</Tab>
                                                    <Tab>Des</Tab>
                                                    <Tab>Dev</Tab>
                                                    <Tab>Test</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.requerimientos).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.analisis).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.diseño).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.desarrollo).toFixed(2)}</TabPanel>
                                                    <TabPanel>S/. {(estimationResult.costo * stagePercentages.pruebas).toFixed(2)}</TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default CocomoTwo;