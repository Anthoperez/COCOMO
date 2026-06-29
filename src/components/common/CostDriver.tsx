import { useState, useEffect } from "react";
import {
  Box,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

type CostDriverProps = {
  label: string;
  options: { [key: string]: { [key: string]: number | null } };
  selectedValues: { [key: string]: string };
  onChange: (group: string, value: string) => void;
};

const CostDriver = ({ label, options, selectedValues, onChange }: CostDriverProps) => {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [localSelectedValues, setLocalSelectedValues] = useState(selectedValues);

  useEffect(() => {
    const defaultValues = Object.keys(options).reduce((acc, optionLabel) => {
      if (!selectedValues[optionLabel]) {
        const defaultOption = Object.entries(options[optionLabel]).find(([level]) => level === "N");
        if (defaultOption) {
          acc[optionLabel] = String(defaultOption[1]);
        }
      } else {
        acc[optionLabel] = selectedValues[optionLabel];
      }
      return acc;
    }, {} as { [key: string]: string });

    setLocalSelectedValues(defaultValues);
    
    Object.entries(defaultValues).forEach(([group, value]) => {
      if (value !== selectedValues[group]) {
        onChange(group, value);
      }
    });
  }, [options, selectedValues, onChange]);

  const handleChange = (group: string, value: string) => {
    setLocalSelectedValues(prev => ({ ...prev, [group]: value }));
    onChange(group, value);
  };

  return (
    <Box mb={1}>
      <Text fontWeight="bold" mb={2}>
        {label}
      </Text>
      <Table variant="simple" size="">
        <Thead>
          <Tr>
            <Th>Option</Th>
            {Object.keys(Object.values(options)[0]).map(level => (
              <Th key={level}>{level}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(options).map(([optionLabel, values]) => (
            <Tr key={optionLabel}>
              <Td><FormLabel>{optionLabel}</FormLabel></Td>
              {Object.entries(values).map(([level, cost]) => (
                <Td key={level}>
                  <Tooltip
                    label={cost !== null ? cost.toFixed(2) : "N/A"}
                    isOpen={hoveredValue === `${optionLabel}-${level}`}
                  >
                    <RadioGroup
                      value={localSelectedValues[optionLabel] || ""}
                      onChange={(value) => handleChange(optionLabel, value)}
                    >
                      <Radio
                        value={String(cost)}
                        isDisabled={cost === null}
                        onMouseEnter={() => setHoveredValue(`${optionLabel}-${level}`)}
                        onMouseLeave={() => setHoveredValue(null)}
                        colorScheme="blue"
                      >
                        {cost !== null ? level : "N/A"}
                      </Radio>
                    </RadioGroup>
                  </Tooltip>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CostDriver;
