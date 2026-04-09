import LegalPage from "@/components/LegalPage";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Política de Privacidad"
      subtitle="Información sobre el tratamiento de tus datos personales"
      lastUpdated="Abril 2025"
      sections={[
        {
          title: "Responsable del Tratamiento",
          content: `<strong class="text-white">EFIZIENTIA ENERGÍAS RENOVABLES SL</strong> (en adelante, "EFIZIENTIA"), con CIF <strong class="text-white">B05310511</strong> y domicilio en Calle Joyería 8, 11408 Jerez de la Frontera (Cádiz), es la entidad responsable del tratamiento de los datos personales que el usuario facilite a través de este sitio web. Puedes contactar con nosotros en <a href="mailto:hola@efizientia.es" style="color:#e91e8c">hola@efizientia.es</a> o en el teléfono <a href="tel:+34856288341" style="color:#e91e8c">+34 856 28 83 41</a>.`,
        },
        {
          title: "Datos que Recopilamos",
          content: [
            "<strong class='text-white'>Datos de identificación:</strong> nombre, apellidos, DNI/NIF cuando sean necesarios para la prestación del servicio.",
            "<strong class='text-white'>Datos de contacto:</strong> dirección de correo electrónico, número de teléfono, dirección postal.",
            "<strong class='text-white'>Datos de consumo energético:</strong> información contenida en las facturas de luz y gas que el usuario suba voluntariamente para obtener el estudio de ahorro.",
            "<strong class='text-white'>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia, mediante cookies analíticas (ver Política de Cookies).",
            "<strong class='text-white'>Datos de comunicación:</strong> contenido de los mensajes enviados a través del formulario de contacto, chat o correo electrónico.",
          ],
        },
        {
          title: "Finalidades y Base Jurídica del Tratamiento",
          content: [
            "<strong class='text-white'>Prestación del servicio de asesoramiento energético:</strong> analizar las facturas subidas y elaborar el estudio de ahorro personalizado. Base jurídica: ejecución de un contrato o medidas precontractuales (Art. 6.1.b RGPD).",
            "<strong class='text-white'>Gestión de consultas y comunicaciones:</strong> responder a las solicitudes de información recibidas por cualquier canal. Base jurídica: interés legítimo (Art. 6.1.f RGPD).",
            "<strong class='text-white'>Envío de comunicaciones comerciales:</strong> informar sobre ofertas, novedades y servicios de EFIZIENTIA, únicamente con tu consentimiento previo. Base jurídica: consentimiento (Art. 6.1.a RGPD).",
            "<strong class='text-white'>Mejora del sitio web:</strong> análisis estadístico del uso de la web para mejorar la experiencia del usuario. Base jurídica: interés legítimo (Art. 6.1.f RGPD).",
            "<strong class='text-white'>Cumplimiento de obligaciones legales:</strong> conservación de datos en los plazos legalmente establecidos. Base jurídica: obligación legal (Art. 6.1.c RGPD).",
          ],
        },
        {
          title: "Conservación de los Datos",
          content: `Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos. Será de aplicación lo dispuesto en la normativa de archivos y documentación. En el caso de datos tratados con base en el consentimiento, los datos se conservarán hasta que el usuario retire dicho consentimiento. Los datos de facturación y consumo energético se conservarán durante un mínimo de <strong class="text-white">5 años</strong> conforme a la normativa fiscal y mercantil vigente.`,
        },
        {
          title: "Comunicación de Datos a Terceros",
          content: `EFIZIENTIA no cederá tus datos personales a terceros, salvo en los siguientes supuestos: <br/><br/>
          <ul style="list-style:disc;padding-left:1.5rem;space-y:0.5rem">
            <li style="margin-bottom:0.5rem">A las <strong class="text-white">comercializadoras de energía</strong> con las que colaboramos, cuando sea necesario para la tramitación de la oferta o contrato energético que hayas solicitado, con tu consentimiento previo.</li>
            <li style="margin-bottom:0.5rem">A <strong class="text-white">proveedores de servicios tecnológicos</strong> (hosting, plataformas CRM, herramientas de análisis) que actúan como encargados del tratamiento bajo contrato y con las garantías adecuadas.</li>
            <li>Cuando sea <strong class="text-white">requerido por ley</strong> o por orden judicial o administrativa.</li>
          </ul>`,
        },
        {
          title: "Transferencias Internacionales de Datos",
          content: `Algunos de nuestros proveedores tecnológicos (como Google Analytics) pueden realizar transferencias internacionales de datos a países fuera del Espacio Económico Europeo. En todos los casos, EFIZIENTIA garantiza que dichas transferencias se realizan con las garantías adecuadas conforme al RGPD, como cláusulas contractuales tipo aprobadas por la Comisión Europea o la existencia de una decisión de adecuación.`,
        },
        {
          title: "Tus Derechos",
          content: [
            "<strong class='text-white'>Acceso:</strong> conocer qué datos personales tuyos tratamos.",
            "<strong class='text-white'>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.",
            "<strong class='text-white'>Supresión:</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios para los fines para los que fueron recabados.",
            "<strong class='text-white'>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.",
            "<strong class='text-white'>Limitación del tratamiento:</strong> solicitar que se restrinja el tratamiento de tus datos.",
            "<strong class='text-white'>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.",
            "<strong class='text-white'>Retirada del consentimiento:</strong> retirar en cualquier momento el consentimiento prestado, sin que ello afecte a la licitud del tratamiento previo.",
            "Para ejercer cualquiera de estos derechos, puedes dirigirte a <a href='mailto:hola@efizientia.es' style='color:#e91e8c'>hola@efizientia.es</a> indicando el derecho que deseas ejercer y adjuntando una copia de tu DNI. También tienes derecho a presentar una reclamación ante la <strong class='text-white'>Agencia Española de Protección de Datos</strong> (<a href='https://www.aepd.es' target='_blank' style='color:#e91e8c'>www.aepd.es</a>).",
          ],
        },
        {
          title: "Seguridad de los Datos",
          content: `EFIZIENTIA ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos. Las facturas y datos de consumo energético se tratan con especial cuidado y se eliminan de los sistemas de procesamiento una vez concluido el estudio de ahorro, conservándose únicamente los datos imprescindibles.`,
        },
        {
          title: "Modificaciones de la Política de Privacidad",
          content: `EFIZIENTIA se reserva el derecho a modificar la presente Política de Privacidad para adaptarla a novedades legislativas o jurisprudenciales, así como a prácticas de la industria. En dichos supuestos, se anunciará en esta página los cambios introducidos con razonable antelación a su puesta en práctica. El uso continuado del sitio web tras la publicación de los cambios implica la aceptación de la nueva Política de Privacidad.`,
        },
      ]}
    />
  );
}
