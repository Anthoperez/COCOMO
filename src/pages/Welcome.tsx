import { Box, Button, Flex, Heading, Text, VStack, Stack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";



const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => navigate("/app/cocomo-two");

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, gray.50, white)">
      <Box maxW="7xl" w="full" px={{ base: 6, md: 12 }} py={{ base: 12, md: 20 }}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 10, md: 12 }} align="center">
          <VStack align="start" spacing={6} w={{ base: '100%', md: '45%' }}>
            <Heading as="h1" size="2xl" lineHeight="1.05">Software de Estimación</Heading>
            <Text fontSize="lg" color="gray.600">Calcula estimaciones con COCOMO II: esfuerzo, tiempo, equipo y costo. Ingresa tus métricas y conductores y obtén un reporte descargable.</Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={2}>
              <Button colorScheme="blue" size="lg" onClick={handleContinue}>Comenzar</Button>
              {/* <Button variant="outline" size="lg" onClick={() => navigate('/app/cocomo')}>Ver COCOMO 81</Button> */}
            </Stack>
            <Text fontSize="sm" color="gray.500">¿Necesitas ayuda para empezar? Consulta la guía y los ejemplos dentro de la app.</Text>
          </VStack>

          <Box w={{ base: '100%', md: '55%' }} display={{ base: 'none', md: 'block' }}>
            <Box boxShadow="lg" borderRadius="md" overflow="hidden" bg="white">
              <Image
                src="/assets/images/welcome-illustration.png"
                alt="Ilustración de bienvenida"
                objectFit="cover"
                w="100%"
                maxH="360px"
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Welcome;
