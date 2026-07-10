import { Box, Button, Flex, Heading, Text, VStack, Stack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";



const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => navigate("/app/cocomo-two");

  return (
    <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, gray.50, white)">
      <Box w="full" px={{ base: 2, md: 6, lg: 8 }} py={{ base: 8, md: 10, lg: 12 }}>
        <Box mx="auto" maxW="8xl" bg="white" borderRadius="4xl" boxShadow="2xl" border="1px solid" borderColor="gray.200" p={{ base: 6, md: 10, lg: 14 }}>
          <Stack
            direction={{ base: 'column-reverse', xl: 'row' }}
            spacing={{ base: 8, md: 10, xl: 16 }}
            align="center"
            justify="space-between"
          >
            <VStack align={{ base: 'center', xl: 'flex-start' }} spacing={5} w={{ base: '100%', xl: '52%' }} textAlign={{ base: 'center', xl: 'start' }}>
              <Heading as="h1" size={{ base: '2xl', md: '4xl' }} lineHeight="1.05">Software de Estimación</Heading>
              <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.600" maxW={{ base: '100%', xl: '90%' }}>
                Calcula estimaciones con COCOMO II: esfuerzo, tiempo, equipo y costo. Ingresa tus métricas y conductores y obtén un reporte descargable.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={2} w="full" justify={{ base: 'center', xl: 'flex-start' }}>
                <Button colorScheme="blue" size="lg" onClick={handleContinue}>Comenzar</Button>
              </Stack>
              <Text fontSize="sm" color="gray.500" maxW={{ base: '100%', xl: '75%' }}>
                ¿Necesitas ayuda para empezar? Consulta la guía y los ejemplos dentro de la app.
              </Text>
            </VStack>

            <Box w={{ base: '100%', xl: '48%' }} maxW="100%">
              <Box boxShadow="2xl" borderRadius="3xl" overflow="hidden" bg="gray.50" border="1px solid" borderColor="gray.200" minH={{ base: '460px', md: '620px', xl: '760px' }}>
                <Image
                  src="/assets/images/welcome-illustration.png"
                  alt="Ilustración de bienvenida"
                  objectFit="cover"
                  objectPosition="center"
                  w="100%"
                  h="100%"
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Welcome;
