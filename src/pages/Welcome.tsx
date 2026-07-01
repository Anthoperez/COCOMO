import { Box, Button, Flex, Text, VStack, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/app/cocomo-two");
  };

  return (
    <Flex
      minH="100vh"
      bg="white"
      overflow="hidden"
      className="welcome-container"
    >
      {/* Lado izquierdo - Contenido */}
      <Flex
        w={{ base: "100%", md: "50%" }}
        bg="linear-gradient(135deg, #3f3f7a 0%, #4a5d99 100%)"
        p={{ base: 8, md: 12 }}
        align="center"
        justify="center"
        color="white"
      >
        <VStack spacing={8} maxW="md" textAlign="left">
          <VStack spacing={4} align="flex-start" w="full">
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              lineHeight="1.2"
            >
              SOFTWARE DE
              <br />
              ESTIMACION
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              opacity={0.95}
              lineHeight="1.6"
            >
              Aquí podrás calcular la estimación de tu software, ingresando las
              especificaciones de métricas y conductores
            </Text>
          </VStack>

          <Button
            onClick={handleContinue}
            bg="rgba(255, 255, 255, 0.2)"
            color="white"
            border="2px solid white"
            borderRadius="md"
            px={8}
            py={6}
            fontSize="sm"
            fontWeight="bold"
            _hover={{
              bg: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
            transition="all 0.3s ease"
            w="fit-content"
          >
            CONTINUAR
          </Button>
        </VStack>
      </Flex>

      {/* Lado derecho - Ilustración */}
      <Flex
        w={{ base: "0%", md: "50%" }}
        bg="linear-gradient(to right, #f8f8f8, #e8e8f0)"
        align="center"
        justify="center"
        p={12}
        position="relative"
        display={{ base: "none", md: "flex" }}
      >
        {/* Contenedor de ilustración SVG */}
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          //maxWidth="500px"
          //maxHeight="500px"
        >
          {/* Fondo circular */}
          <circle cx="250" cy="200" r="140" fill="#e8d5e8" opacity="0.5" />

          {/* Persona */}
          <circle cx="250" cy="130" r="35" fill="#000" /> {/* Cabeza */}
          <rect
            x="220"
            y="170"
            width="60"
            height="80"
            fill="#4ea3de"
            rx="10"
          /> {/* Torso */}
          <rect
            x="210"
            y="165"
            width="15"
            height="120"
            fill="#4ea3de"
            rx="7"
          /> {/* Brazo izquierdo */}
          <rect
            x="275"
            y="165"
            width="15"
            height="120"
            fill="#4ea3de"
            rx="7"
          /> {/* Brazo derecho */}
          <line
            x1="245"
            y1="250"
            x2="235"
            y2="330"
            stroke="#3d2817"
            strokeWidth="12"
            strokeLinecap="round"
          /> {/* Pierna izquierda */}
          <line
            x1="255"
            y1="250"
            x2="265"
            y2="330"
            stroke="#3d2817"
            strokeWidth="12"
            strokeLinecap="round"
          /> {/* Pierna derecha */}
          {/* Portapapeles en mano */}
          <rect x="310" y="140" width="80" height="100" fill="#3d5a80" rx="5" /> {/* Marco del portapapeles */}
          <rect
            x="315"
            y="150"
            width="70"
            height="75"
            fill="#e8e8e8"
            rx="3"
          /> {/* Papel */}
          {/* Líneas del formulario */}
          <line x1="325" y1="165" x2="375" y2="165" stroke="#999" strokeWidth="2" />
          <circle cx="330" cy="185" r="5" fill="#999" />
          <circle cx="350" cy="185" r="5" fill="#999" />
          <circle cx="370" cy="185" r="5" fill="#999" />
          <line x1="325" y1="205" x2="375" y2="205" stroke="#999" strokeWidth="2" />
          <circle cx="330" cy="210" r="3" fill="#999" />
          <circle cx="345" cy="210" r="3" fill="#999" />
          <circle cx="360" cy="210" r="3" fill="#999" />

          {/* Calculadora */}
          <rect x="100" y="280" width="90" height="120" fill="#ff9800" rx="8" /> {/* Cuerpo */}
          <rect x="110" y="295" width="70" height="55" fill="#1a1a1a" rx="3" /> {/* Pantalla */}
          {/* Botones de la calculadora */}
          <circle cx="120" cy="365" r="6" fill="#e0e0e0" />
          <circle cx="138" cy="365" r="6" fill="#e0e0e0" />
          <circle cx="156" cy="365" r="6" fill="#e0e0e0" />
          <circle cx="174" cy="365" r="6" fill="#e0e0e0" />
          <circle cx="120" cy="385" r="6" fill="#e0e0e0" />
          <circle cx="138" cy="385" r="6" fill="#e0e0e0" />
          <circle cx="156" cy="385" r="6" fill="#e0e0e0" />
          <circle cx="174" cy="385" r="6" fill="#e0e0e0" />

          {/* Monedas */}
          <circle cx="380" cy="340" r="20" fill="#ffd700" />
          <circle cx="380" cy="340" r="18" fill="none" stroke="#daa520" strokeWidth="2" />
          <text x="375" y="345" fontSize="12" fill="#daa520" fontWeight="bold">
            $
          </text>

          <circle cx="410" cy="310" r="18" fill="#ffd700" />
          <circle cx="410" cy="310" r="16" fill="none" stroke="#daa520" strokeWidth="2" />
          <text x="405" y="315" fontSize="10" fill="#daa520" fontWeight="bold">
            $
          </text>

          <circle cx="430" cy="345" r="16" fill="#ffd700" />
          <circle cx="430" cy="345" r="14" fill="none" stroke="#daa520" strokeWidth="2" />
          <text x="425" y="350" fontSize="9" fill="#daa520" fontWeight="bold">
            $
          </text>
        </svg>
      </Flex>
    </Flex>
  );
};

export default Welcome;
