import React, { FormEvent, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Checkbox,
    Alert,
    AlertIcon
} from "@chakra-ui/react";

import { StageType, StageValues, StagePercentages } from '../../client/models'

interface CpmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCalculate: (total: number, stagePercentages: StagePercentages) => void;
    onSubmit: () => void;
}

const CpmModal = ({ isOpen, onClose, onCalculate, onSubmit }: CpmModalProps) => {
    const [values, setValues] = useState<{
        [key in StageType]: StageValues;
    }>({
        requerimientos: { percentage: "", cost: "", disabled: false },
        analisis: { percentage: "", cost: "", disabled: false },
        diseño: { percentage: "", cost: "", disabled: false },
        desarrollo: { percentage: "", cost: "", disabled: false },
        pruebas: { percentage: "", cost: "", disabled: false },
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        let totalWeightedCost = 0;
        let totalPercentage = 0;
        const stagePercentages: StagePercentages = {
            requerimientos: 0,
            analisis: 0,
            diseño: 0,
            desarrollo: 0,
            pruebas: 0
        };

        (Object.keys(values) as StageType[]).forEach((key) => {
            const stage = values[key];
            if (!stage.disabled && stage.percentage !== "" && stage.cost !== "") {
                const percentage = parseFloat(stage.percentage);
                const cost = parseFloat(stage.cost);
                totalWeightedCost += (percentage / 100) * cost;
                totalPercentage += percentage;
                stagePercentages[key] = percentage / 100;
            }
        });

        // Validación: los porcentajes deben sumar 100
        if (Math.abs(totalPercentage - 100) > 0.01) {
            setError("La suma de los porcentajes debe ser exactamente 100%");
            return;
        }

        setError(null);

        // CPM promedio ponderado para COCOMO 81
        let weightedAverageCpm = totalWeightedCost / (totalPercentage / 100);
        weightedAverageCpm = Number(weightedAverageCpm.toFixed(2));

        onCalculate(weightedAverageCpm, stagePercentages);
        onSubmit();
        onClose();
    };

    const handlePercentageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: StageType
    ) => {
        const { value } = e.target;
        setValues((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                percentage: value,
            },
        }));
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>, id: StageType) => {
        const { value } = e.target;
        setValues((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                cost: value,
            },
        }));
    };

    const handleCheckboxChange = (id: StageType) => {
        setValues((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                percentage: "",
                cost: "",
                disabled: !prev[id].disabled,
            },
        }));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: "sm", md: "lg", lg: "xl" }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit}>
                    <ModalHeader>CPM por Etapas</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            {error && (
                                <Alert status="error">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                            {Object.keys(values).map((key) => (
                                <RowWithCheckbox
                                    key={key}
                                    id={key as StageType}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    values={values[key as StageType]}
                                    handlePercentageChange={handlePercentageChange}
                                    handleCostChange={handleCostChange}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </VStack>
                    </ModalBody>
                    <HStack justify="flex-end" p={4}>
                        <button
                            type="submit"
                            style={{
                                background: "#1d9ef2",
                                color: "white",
                                borderRadius: "4px",
                                padding: "8px 16px",
                                border: "none",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Aceptar
                        </button>
                    </HStack>
                </ModalContent>
            </Modal>
        </>
    );
};

interface RowWithCheckboxProps {
    id: StageType;
    label: string;
    values: StageValues;
    handlePercentageChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        id: StageType
    ) => void;
    handleCostChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        id: StageType
    ) => void;
    handleCheckboxChange: (id: StageType) => void;
}

const RowWithCheckbox = ({
    id,
    label,
    values,
    handlePercentageChange,
    handleCostChange,
    handleCheckboxChange,
}: RowWithCheckboxProps) => {
    return (
        <HStack spacing={4} align="center">
            <FormControl id={`${id}Percentage`} isDisabled={values.disabled}>
                <FormLabel>{`Porcentaje de ${label}`}</FormLabel>
                <Input
                    placeholder="Ejemplo: %: 40, 65, 100"
                    type="number"
                    value={values.percentage}
                    onChange={(e) => handlePercentageChange(e, id)}
                />
            </FormControl>
            <FormControl id={`${id}Cost`} isDisabled={values.disabled}>
                <FormLabel>{`Costo de ${label}`}</FormLabel>
                <Input
                    placeholder="Ejemplo: 1000"
                    type="number"
                    value={values.cost}
                    onChange={(e) => handleCostChange(e, id)}
                />
            </FormControl>
            <Checkbox
                id={`${id}Check`}
                onChange={() => handleCheckboxChange(id)}
            />
        </HStack>
    );
};

export default CpmModal;