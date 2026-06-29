import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiCpu, FiUsers,FiLayers,FiBriefcase } from "react-icons/fi"; // Cambia FiBriefcase por FiCpu

const items = [
  //{ icon: FiCpu, title: "Cocomo 81", path: "/cocomo" }, // Usa FiCpu aquí
  { icon: FiCpu, title: "Cocomo II", path: "/cocomo-two" },
  //{ icon: FiLayers, title: "Puntos de Funcion", path: "/function-point" },
  //{ icon: FiBriefcase, title: "Use Case Point", path: "/use-case-point" },
];

interface NavbarItemsProps {
  onClose?: () => void;
}

const NavbarItems = ({ onClose }: NavbarItemsProps) => {
  const textColor = useColorModeValue("ui.main", "ui.light");
  const currentUser = { email: "oscare.c.s@hotmail.com", is_superuser: false };

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items;

  return (
    <Flex as="ul" listStyleType="none" ml="auto" display={{ base: "none", md: "flex" }}>
      {finalItems.map(({ icon, title, path }) => (
        <Flex
          as={Link}
          to={path}
          key={title}
          align="center"
          mx={3}
          color={textColor}
          _hover={{ textDecoration: "none", color: "blue.500" }} // hover azul
          onClick={onClose}
        >
          <Icon as={icon} boxSize={6} color="blue.500" /> {/* icono más grande y azul */}
          <Text
            ml={2}
            fontSize="xl" 
            fontWeight="bold" 
            color="blue.500" 
            letterSpacing="wide"
          >
            {title}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default NavbarItems;
