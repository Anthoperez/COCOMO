import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  // Menu,
  // MenuButton,
  // MenuItem,
  // MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { FiLogOut, FiMenu } from "react-icons/fi";
//import { FaUserAstronaut } from "react-icons/fa";

import Logo from "/assets/images/Cocomo.svg";
import NavbarItems from "./NavbarItems";

// const currentUser = { email: "oscare.c.s@hotmail.com", is_superuser: false };

const Navbar = () => {
  const bgColor = useColorModeValue("ui.light", "ui.dark");
  //const textColor = useColorModeValue("ui.main", "ui.light");
  //const secBgColor = useColorModeValue("ui.secondary", "ui.darkSlate");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = async () => {
    // logout();
    console.log("Cerrando sesión...");
  };

  return (
    <>
      {/* Mobile */}
      <Flex
        bg={bgColor}
        p={4}
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        width="full"
        position="sticky"
        top="0"
        zIndex="sticky"
        display={{ base: "flex", md: "none" }}
      >
        <Image src={Logo} alt="Logo" h="40px" />
        <Flex alignItems="center">
          {/* Elimina o comenta este bloque para ocultar el icono de usuario */}
          {/*
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Opciones de Usuario"
              icon={<FaUserAstronaut color="white" fontSize="18px" />}
              bg="ui.main"
              isRound
              mr={4}
            />
            <MenuList>
              <MenuItem icon={<FiHelpCircle />} as="a" href="/help">
                Help
              </MenuItem>
              <MenuItem
                icon={<FiLogOut />}
                onClick={handleLogout}
                color="ui.danger"
                fontWeight="bold"
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
          */}
          <IconButton
            onClick={onOpen}
            aria-label="Abrir menú"
            icon={<FiMenu />}
            fontSize="20px"
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="250px">
          <DrawerCloseButton />
          <DrawerBody py={8}>
            <Flex flexDir="column" justify="space-between">
              <Box>
                <Image src={Logo} alt="logo" p={6} />
                <NavbarItems onClose={onClose} />
                <Flex
                  as="button"
                  onClick={handleLogout}
                  p={2}
                  color="ui.danger"
                  fontWeight="bold"
                  alignItems="center"
                >
                  <FiLogOut />
                  <Text ml={2}>Log out</Text>
                </Flex>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop */}
      <Flex
        bg={bgColor}
        p={4}
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        width="full"
        position="sticky"
        top="0"
        zIndex="sticky"
        display={{ base: "none", md: "flex" }}
      >
        <Flex alignItems="center">
          <Image src={Logo} alt="Logo" h="40px" />
        </Flex>

        <NavbarItems />

        <Flex alignItems="center">
          {/* Elimina o comenta este bloque para ocultar el icono de usuario */}
          {/*
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Opciones de Usuario"
              icon={<FaUserAstronaut color="white" fontSize="18px" />}
              bg="ui.main"
              isRound
              ml={4}
            />
            <MenuList>
              <MenuItem icon={<FiHelpCircle />} as="a" href="/help">
                Help
              </MenuItem>
              <MenuItem
                icon={<FiLogOut />}
                onClick={handleLogout}
                color="ui.danger"
                fontWeight="bold"
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
          */}
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;
