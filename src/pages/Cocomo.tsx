import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
    Box, Container, Text, FormControl, Input, Button, FormLabel,
    Select, VStack, Stack, Switch, useDisclosure,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    HStack,
    SimpleGrid
} from "@chakra-ui/react";
import { CocomoForm, CocomoOut } from '../client/models';
import { MethodsService } from '../client/services';
import CostDriver from '../components/common/CostDriver';
import CpmModal from '../components/cocomo/CpmModal';
import { StagePercentages } from '../client/models';

import HelpModal from '../components/cocomo/helpModal';
import EquationsModal from '../components/cocomo/EquationsModal';


const Cocomo = () => {
    const [formData, setFormData] = useState<CocomoForm>({
        mode: '',
        kdlc: 0,
        cpm: 0,
        costDrivers: []
    });
    const [loading, setLoading] = useState(false);
    const [selectedCostDrivers, setSelectedCostDrivers] = useState<{ [key: string]: string }>({});
    const [estimationResult, setEstimationResult] = useState<CocomoOut | null>(null);

    const [isStagesEnabled, setIsStagesEnabled] = useState(false);
    const resultSectionRef = useRef<HTMLDivElement>(null);

    const cpmModal = useDisclosure();
    const helpModal = useDisclosure();
    const equationModal = useDisclosure();

    const [stagePercentages, setStagePercentages] = useState<StagePercentages>({
        requirements: 0,
        analysis: 0,
        design: 0,
        development: 0,
        testing: 0
    });

    const costDrivers = {
        PRODUCT: {
            RSS: { VL: 0.75, L: 0.88, N: 1.00, H: 1.15, VH: 1.40, EH: null },
            TBD: { VL: null, L: 0.94, N: 1.00, H: 1.08, VH: 1.16, EH: null },
            CPR: { VL: 0.70, L: 0.85, N: 1.00, H: 1.15, VH: 1.30, EH: 1.65 },
        },
        PROJECT: {
            UTP: { VL: 1.24, L: 1.10, N: 1.00, H: 0.91, VH: 0.82, EH: null },
            UHS: { VL: 1.24, L: 1.10, N: 1.00, H: 0.91, VH: 0.83, EH: 0.70 },
            RPL: { VL: 1.23, L: 1.08, N: 1.00, H: 1.04, VH: 1.10, EH: null },
        },
        PLATAFORM: {
            RTE: { VL: null, L: null, N: 1.00, H: 1.11, VH: 1.30, EH: 1.66 },
            RMP: { VL: null, L: null, N: 1.00, H: 1.06, VH: 1.30, EH: 1.58 },
            VMC: { VL: null, L: 0.87, N: 1.00, H: 1.15, VH: 1.30, EH: null },
            TRC: { VL: null, L: 0.87, N: 1.00, H: 1.07, VH: 1.15, EH: null },
        },
        PERSONAL: {
            CAN: { VL: 1.46, L: 1.19, N: 1.00, H: 0.86, VH: 0.71, EH: null },
            EAN: { VL: 1.29, L: 1.13, N: 1.00, H: 0.91, VH: 0.82, EH: null },
            CPRO: { VL: 1.42, L: 1.17, N: 1.00, H: 0.86, VH: 0.70, EH: null },
            ESO: { VL: 1.21, L: 1.12, N: 1.00, H: 0.96, VH: null, EH: null },
            ELP: { VL: 1.14, L: 1.10, N: 1.00, H: 0.95, VH: null, EH: null },
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

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = MethodsService.cocomo(formData);
            setEstimationResult(result); // Store the result in state
            console.log(result);
            console.log('Selected Cost Drivers Array:', formData.costDrivers);
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
        setIsStagesEnabled(!isStagesEnabled);
        if(!isStagesEnabled){
            cpmModal.onOpen();
        }
    };

    // Función para manejar el cálculo del CPM y actualizar el estado en formData
    const handleCpmCalculation = (total: number, percentages: StagePercentages) => {
        setFormData((prevData) => ({
            ...prevData,
            cpm: total,
        }));
        setStagePercentages(percentages);
    };

    const handleModalSubmit = () => {
        // No cambies isStagesEnabled aquí
    };

    return (
        <Container maxW="full">
            <Box pt={1} mx={2}>
                <HStack mb={1}>
                    <Text fontSize="xl">COCOMO</Text>
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
                    <VStack spacing={2} align="stretch">
                        <Stack direction={['column', 'row']} spacing={4} align="center" w="full">
                            <FormControl id="mode" isRequired>
                                <FormLabel>Mode</FormLabel>
                                <Select
                                    id="mode"
                                    placeholder="Select mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                >
                                    <option value="Organico">Organico</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Embedido">Embedido</option>
                                </Select>
                            </FormControl>

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
                                    onChange={handleChange} // <-- Permite edición manual
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Stages?</FormLabel>
                                <Switch
                                    id='stages'
                                    onChange={handleSwitchChange}
                                    isChecked={isStagesEnabled}
                                    colorScheme="blue" 
                                />
                            </FormControl>
                        </Stack>

                        <FormControl id="costdrivers">
                            <Text mb={2} fontWeight="bold">Cost Drivers</Text>
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
                        </FormControl>

                        <Button variant="solid" type="submit" isLoading={loading} size="sm" colorScheme="blue">
                            Estimate
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
                    <Box mt={3} ref={resultSectionRef}>
                        <HStack mb={1}>
                            <Text fontSize="xl">Equations</Text>
                            <Button 
                                colorScheme='teal' 
                                variant='outline'
                                size='sm'
                                onClick={equationModal.onOpen}>
                                ?
                            </Button>
                        </HStack>
                        <EquationsModal isOpen={equationModal.isOpen} onClose={equationModal.onClose} mode={formData.mode} />

                        <Text fontSize="xl" mb={4}>Estimation Results</Text>
                        <Box borderWidth="1px" borderRadius="lg" p={2} mb={2}>
                            <VStack spacing={4} align="stretch">
                                <Stack direction={["column", "row"]} spacing={4}>
                                    <FormControl id="esf">
                                        <FormLabel>ESF</FormLabel>
                                        {/* <Input type="text" value={estimationResult.esf.toFixed(2)} isReadOnly /> */}
                                        <HStack>
                                            <Text>{estimationResult.esf.toFixed(2)}</Text>
                                            <Text fontStyle="italic"> Persons-Month</Text>
                                        </HStack>
                                    </FormControl>
                                    <FormControl id="tdes">
                                        <FormLabel>TDES</FormLabel>
                                        {/* <Input type="text" value={estimationResult.tdes.toFixed(2)} isReadOnly /> */}
                                        <HStack>
                                            <Text>{estimationResult.tdes.toFixed(2)}</Text>
                                            <Text fontStyle="italic"> Months</Text>
                                        </HStack>
                                    </FormControl>
                                    </Stack>
                                    <Stack direction={["column", "row"]} spacing={4}>
                                    <FormControl id="n">
                                        <FormLabel>Workers</FormLabel>
                                        {/* <Input type="text" value={estimationResult.n.toFixed(2)} isReadOnly /> */}
                                        <HStack>
                                            <Text>{estimationResult.n.toFixed(2)}</Text>
                                            <Text fontStyle="italic"> Persons</Text>
                                        </HStack>
                                    </FormControl>
                                    <FormControl id="productividad">
                                        <FormLabel>Productivity</FormLabel>
                                        <HStack>
                                            <Text>{estimationResult.productividad.toFixed(2)}</Text>
                                            <Text fontStyle="italic"> KLDC/Persons-Month</Text>
                                        </HStack>
                                    </FormControl>
                                </Stack>
                                <FormControl id="costo">
                                    <FormLabel>Total Cost</FormLabel>
                                    {/* <Input type="text" value={estimationResult.costo.toFixed(2)} isReadOnly /> */}
                                    <HStack>
                                        <Text>{estimationResult.costo.toFixed(2)}</Text>
                                        <Text fontStyle="italic"> Soles</Text>
                                    </HStack>
                                </FormControl>
                                {isStagesEnabled && (
                                    <>
                                        <Text mt={4}>
                                            Nota: Los costos de etapa son válidos solo para la suma de porcentajes = , de lo contrario arrojará resultados inconsistentes.
                                        </Text>
                                        <Tabs variant='soft-rounded' colorScheme='green' isFitted>
                                            <TabList>
                                                <Tab>Req</Tab>
                                                <Tab>Ana</Tab>
                                                <Tab>Des</Tab>
                                                <Tab>Dev</Tab>
                                                <Tab>Test</Tab>
                                            </TabList>
                                            <TabPanels>
                                                <TabPanel>S/. {(estimationResult.costo * stagePercentages.requirements).toFixed(2)}</TabPanel>
                                                <TabPanel>S/. {(estimationResult.costo * stagePercentages.analysis).toFixed(2)}</TabPanel>
                                                <TabPanel>S/. {(estimationResult.costo * stagePercentages.design).toFixed(2)}</TabPanel>
                                                <TabPanel>S/. {(estimationResult.costo * stagePercentages.development).toFixed(2)}</TabPanel>
                                                <TabPanel>S/. {(estimationResult.costo * stagePercentages.testing).toFixed(2)}</TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                    </>
                                )}
                            </VStack>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Cocomo;
