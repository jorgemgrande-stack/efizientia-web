import LegalPage from "@/components/LegalPage";

export default function LegalNotice() {
  return (
    <LegalPage
      title="Aviso Legal"
      subtitle="Condiciones de uso del sitio web efizientia.es"
      lastUpdated="Abril 2025"
      sections={[
        {
          title: "Datos Identificativos del Titular",
          content: `En cumplimiento del <strong class="text-white">artículo 10 de la Ley 34/2002</strong>, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, a continuación se exponen los datos identificativos del presente portal de internet:<br/><br/>
          <ul style="list-style:none;space-y:0.5rem">
            <li style="margin-bottom:0.5rem"><strong class="text-white">Titular:</strong> EFIZIENTIA ENERGÍAS RENOVABLES SL (en adelante, "EFIZIENTIA")</li>
            <li style="margin-bottom:0.5rem"><strong class="text-white">CIF:</strong> B05310511</li>
            <li style="margin-bottom:0.5rem"><strong class="text-white">Actividad:</strong> Asesoramiento y consultoría energética, comercialización de energía eléctrica y gas natural, energías renovables.</li>
            <li style="margin-bottom:0.5rem"><strong class="text-white">Domicilio social:</strong> Calle Joyería 8, 11408 Jerez de la Frontera (Cádiz)</li>
            <li style="margin-bottom:0.5rem"><strong class="text-white">Email de contacto:</strong> <a href="mailto:hola@efizientia.es" style="color:#e91e8c">hola@efizientia.es</a></li>
            <li style="margin-bottom:0.5rem"><strong class="text-white">Página web:</strong> <a href="https://efizientia.es" style="color:#e91e8c">www.efizientia.es</a></li>
            <li><strong class="text-white">Teléfono de contacto:</strong> <a href="tel:+34856288341" style="color:#e91e8c">+34 856 28 83 41</a></li>
          </ul><br/>
          EFIZIENTIA informa que el acceso a este sitio web o su utilización en cualquier forma implican la aceptación de la totalidad de lo dispuesto en el presente Aviso Legal. EFIZIENTIA se reserva el derecho de modificar en cualquier momento el presente Aviso.`,
        },
        {
          title: "Objeto y Ámbito de Aplicación",
          content: `El presente Aviso Legal regula el acceso y utilización del sitio web <a href="https://efizientia.es" style="color:#e91e8c">efizientia.es</a> (en adelante, el "Sitio Web"), del que es titular EFIZIENTIA ENERGÍAS RENOVABLES SL.<br/><br/>
          A través del Sitio Web, EFIZIENTIA facilita a los usuarios el acceso a información sobre sus servicios de asesoramiento energético, la realización de estudios de ahorro energético mediante el análisis de facturas de luz y gas, información sobre tarifas y comercializadoras, y otros contenidos relacionados con el sector energético. El acceso al Sitio Web es libre y gratuito, si bien la utilización de ciertos servicios puede requerir el registro previo del usuario.`,
        },
        {
          title: "Propiedad Intelectual e Industrial",
          content: `El código fuente, los diseños gráficos, los logotipos (incluida la mascota "Efi" y todos los personajes "Efizientes"), las imágenes, los vídeos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en el presente Sitio Web están protegidos por la legislación española sobre derechos de propiedad intelectual e industrial a favor de EFIZIENTIA y no se permite la reproducción y/o publicación, total o parcial, del Sitio Web, ni su tratamiento informático, distribución, difusión, modificación, transformación o descompilación, sin el permiso previo y por escrito de EFIZIENTIA.<br/><br/>
          El usuario, única y exclusivamente, puede utilizar el material que aparezca en este Sitio Web para su uso personal y privado, quedando prohibido su uso con fines comerciales o para incurrir en actividades ilícitas. Todos los derechos derivados de la propiedad intelectual están expresamente reservados por EFIZIENTIA®.`,
        },
        {
          title: "Condiciones de Uso",
          content: [
            "El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos a través del Sitio Web y a no emplearlos para realizar actividades ilícitas o contrarias a la buena fe y al ordenamiento legal.",
            "Queda prohibido el uso del Sitio Web con fines fraudulentos, la introducción de virus informáticos o cualquier otro elemento dañino, así como la realización de cualquier acción que pueda dañar, inutilizar, sobrecargar o deteriorar el Sitio Web o impedir su normal utilización.",
            "El usuario es responsable de la veracidad y exactitud de los datos que facilite a EFIZIENTIA a través de los formularios del Sitio Web, en particular los datos de contacto y las facturas energéticas subidas para el estudio de ahorro.",
            "EFIZIENTIA se reserva el derecho de denegar o retirar el acceso al Sitio Web, en cualquier momento y sin necesidad de preaviso, a aquellos usuarios que incumplan las presentes condiciones de uso.",
          ],
        },
        {
          title: "Exclusión de Garantías y Responsabilidad",
          content: `EFIZIENTIA no garantiza la disponibilidad y continuidad del funcionamiento del Sitio Web. Cuando ello sea razonablemente posible, EFIZIENTIA advertirá previamente de las interrupciones en el funcionamiento del Sitio Web. EFIZIENTIA tampoco garantiza la utilidad del Sitio Web para la realización de ninguna actividad en concreto, ni su infalibilidad.<br/><br/>
          Los estudios de ahorro energético elaborados a partir de las facturas subidas por el usuario son orientativos y están basados en los datos disponibles en el momento del análisis. EFIZIENTIA no garantiza el ahorro exacto indicado, que puede variar en función de cambios en el mercado energético, el consumo real del usuario y otros factores externos.`,
        },
        {
          title: "Protección de Datos de Carácter Personal",
          content: `EFIZIENTIA, como responsable del tratamiento de los datos personales del usuario, informa que estos datos serán tratados de conformidad con lo dispuesto en el <strong class="text-white">Reglamento (UE) 2016/679 de 27 de abril de 2016 (RGPD)</strong> y la <strong class="text-white">Ley Orgánica 3/2018 de 5 de diciembre (LOPDGDD)</strong>. Para más información, consulta nuestra <a href="/privacidad" style="color:#e91e8c">Política de Privacidad</a>.`,
        },
        {
          title: "Uso de Cookies",
          content: `EFIZIENTIA utiliza cookies propias y de terceros para mejorar la experiencia de navegación y analizar el uso del Sitio Web. Para más información sobre las cookies utilizadas y cómo gestionarlas, consulta nuestra <a href="/cookies" style="color:#e91e8c">Política de Cookies</a>.`,
        },
        {
          title: "Legislación Aplicable y Jurisdicción",
          content: `Las relaciones entre EFIZIENTIA y los usuarios de sus servicios presentes en este Sitio Web se encuentran sometidas a la legislación y jurisdicción españolas. Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso del Sitio Web, las partes se someten a los Juzgados y Tribunales de <strong class="text-white">Jerez de la Frontera (Cádiz)</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.<br/><br/>
          No obstante lo anterior, para la resolución de litigios en línea relativos a contratos de compraventa o de prestación de servicios celebrados en línea entre consumidores y comerciantes, la Comisión Europea pone a disposición la plataforma de resolución de litigios en línea de la UE: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" style="color:#e91e8c">https://ec.europa.eu/consumers/odr/</a>.`,
        },
      ]}
    />
  );
}
