import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FiCpu, FiUsers } from "react-icons/fi";

const items = [
  //{ icon: FiCpu, title: "Cocomo 81", path: "/app/cocomo" }, // Usa FiCpu aquí
  { icon: FiCpu, title: "Cocomo II", path: "/app/cocomo-two" },
  //{ icon: FiLayers, title: "Puntos de Funcion", path: "/app/function-point" },
  //{ icon: FiBriefcase, title: "Use Case Point", path: "/app/use-case-point" },
];

interface NavbarItemsProps {
  onClose?: () => void;
}

const NavbarItems = ({ onClose }: NavbarItemsProps) => {
  const textColor = useColorModeValue("ui.main", "ui.light");
  const location = useLocation();
  const currentUser = { email: "oscare.c.s@hotmail.com", is_superuser: false };

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items;

  // Filtrar items para ocultar el que coincida con la ruta actual
  const visibleItems = finalItems.filter(item => item.path !== location.pathname);

  return (
    <Flex as="ul" listStyleType="none" ml="auto" display={{ base: "none", md: "flex" }}>
      {visibleItems.map(({ icon, title, path }) => (
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
