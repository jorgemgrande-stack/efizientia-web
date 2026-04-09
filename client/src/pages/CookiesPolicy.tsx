import LegalPage from "@/components/LegalPage";

export default function CookiesPolicy() {
  return (
    <LegalPage
      title="Política de Cookies"
      subtitle="Información sobre el uso de cookies en efizientia.es"
      lastUpdated="Abril 2025"
      sections={[
        {
          title: "¿Qué son las cookies?",
          content: `Una cookie es un fichero que se descarga en el ordenador, smartphone o tablet del usuario cuando éste accede a determinadas páginas web, con la finalidad de almacenar y recuperar información sobre la navegación efectuada desde dicho equipo. Las cookies permiten a un sitio web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que se utilice, pueden emplearse para reconocer al usuario.<br/><br/>
          <strong class="text-white">EFIZIENTIA ENERGÍAS RENOVABLES SL</strong> (CIF: B05310511), titular del sitio web <a href="https://efizientia.es" style="color:#e91e8c">efizientia.es</a>, informa que, según el artículo 22 de la Ley de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), así como en el Considerando (30) del RGPD, este sitio web utiliza cookies tanto propias como de terceros con diversas finalidades.`,
        },
        {
          title: "Tipos de Cookies que Utilizamos",
          content: [
            "<strong class='text-white'>Cookies técnicas (estrictamente necesarias):</strong> Son imprescindibles para el correcto funcionamiento del sitio web. Permiten al usuario navegar por la web y utilizar sus funcionalidades básicas. Sin estas cookies, algunos servicios no podrían prestarse.",
            "<strong class='text-white'>Cookies analíticas (Google Analytics):</strong> Permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que le ofrecemos. Los datos recogidos son anónimos y no permiten identificar al usuario de forma individual.",
            "<strong class='text-white'>Cookies de preferencias:</strong> Permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios, como el idioma, el número de resultados a mostrar cuando el usuario realiza una búsqueda, el aspecto o contenido del servicio en función del tipo de navegador a través del cual el usuario accede al servicio.",
            "<strong class='text-white'>Cookies de terceros:</strong> Algunas funcionalidades del sitio web pueden ser prestadas por terceros (como redes sociales o plataformas de análisis), que instalan sus propias cookies sujetas a sus respectivas políticas de privacidad.",
          ],
        },
        {
          title: "Cookies de Google Analytics",
          content: [
            "<strong class='text-white'>_ga:</strong> Distingue a los usuarios. Caducidad: 2 años. Tipo: analítica de tercero (Google Inc.).",
            "<strong class='text-white'>_gid:</strong> Distingue a los usuarios. Caducidad: 24 horas. Tipo: analítica de tercero (Google Inc.).",
            "<strong class='text-white'>_gat:</strong> Limita el porcentaje de solicitudes. Caducidad: 1 minuto. Tipo: analítica de tercero (Google Inc.).",
            "Puedes inhabilitar el uso de estas cookies instalando el <a href='https://tools.google.com/dlpage/gaoptout' target='_blank' style='color:#e91e8c'>complemento de inhabilitación de Google Analytics</a> para navegadores.",
          ],
        },
        {
          title: "Cómo Gestionar y Desactivar las Cookies",
          content: [
            "<strong class='text-white'>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.",
            "<strong class='text-white'>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio.",
            "<strong class='text-white'>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.",
            "<strong class='text-white'>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web.",
            "<strong class='text-white'>Opera:</strong> Configuración → Privacidad y seguridad → Cookies.",
            "Ten en cuenta que deshabilitar las cookies puede afectar al funcionamiento de algunas funcionalidades del sitio web.",
          ],
        },
        {
          title: "Consentimiento",
          content: `Al navegar por <a href="https://efizientia.es" style="color:#e91e8c">efizientia.es</a> y no haber desactivado las cookies en tu navegador, aceptas el uso de cookies de acuerdo con la presente Política de Cookies. Puedes revocar tu consentimiento en cualquier momento configurando tu navegador para rechazar las cookies o eliminando las cookies ya instaladas.`,
        },
        {
          title: "Actualizaciones de la Política de Cookies",
          content: `EFIZIENTIA puede actualizar la Política de Cookies de su sitio web. Te recomendamos revisar esta política cada vez que accedas a nuestro sitio web con el objetivo de estar adecuadamente informado sobre cómo y para qué usamos las cookies. La política fue actualizada por última vez en <strong class="text-white">abril de 2025</strong>.`,
        },
        {
          title: "Más Información",
          content: `Para cualquier consulta sobre el uso de cookies en este sitio web, puedes contactar con EFIZIENTIA en <a href="mailto:hola@efizientia.es" style="color:#e91e8c">hola@efizientia.es</a>. También puedes obtener más información sobre las cookies en la <a href="https://www.aepd.es" target="_blank" style="color:#e91e8c">Agencia Española de Protección de Datos (AEPD)</a>.`,
        },
      ]}
    />
  );
}
