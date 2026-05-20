import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '800px' }}>
                <div className="auth-content" style={{ padding: '40px', textAlign: 'left' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', color: '#0066CC', textDecoration: 'none', fontWeight: 500 }}>
                            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                            Volver al registro
                        </Link>
                    </div>
                    
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', marginBottom: '24px' }}>Política de Privacidad y Protección de Datos Personales</h1>
                    
                    <div style={{ color: '#475569', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p>Última actualización: 19 de mayo de 2026</p>
                        <p>La presente Política de Privacidad describe el tratamiento que Sicam (en adelante, la "Plataforma" o "nosotros") realiza con los datos personales que se recopilan y almacenan a través del sistema, cumpliendo de manera estricta con la Ley Orgánica de Protección de Datos Personales (LODP) de Ecuador, las regulaciones de la Autoridad de Protección de Datos, y los códigos deontológicos de la práctica médica.</p>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN I: ROLES EN EL TRATAMIENTO DE DATOS</h2>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Responsable del Tratamiento:</strong> El profesional de la salud o consultorio médico (ej. Dra. María Fernanda Terán) que recaba de forma directa los datos de sus pacientes en su consulta médica es el Responsable del Tratamiento ante la Ley. Es quien decide qué datos solicitar y con qué fin médico utilizarlos.</li>
                                <li><strong>Encargado del Tratamiento:</strong> Sicam actúa únicamente como el Encargado del Tratamiento. Nosotros no somos propietarios de la información clínica ni de contacto de los pacientes, ni decidimos sobre su uso. Nuestro rol se limita a proveer el almacenamiento ultra-seguro en la nube, la encriptación de los datos y el soporte técnico para que el Responsable pueda operar la información.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN II: TIPOS DE DATOS RECOPILADOS</h2>
                            <p>A través de la Plataforma, se procesan dos tipos de datos:</p>
                            <p><strong>Datos de los Usuarios (Profesionales de la salud):</strong></p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                                <li>Nombre y Apellidos.</li>
                                <li>Correo electrónico corporativo o personal.</li>
                                <li>Credenciales de acceso (contraseñas encriptadas con algoritmo seguro unidireccional de tipo Hash).</li>
                                <li>Registro único de contribuyente o identificación profesional (ej. cédula, registro ministerial).</li>
                            </ul>
                            <p><strong>Datos de los Pacientes (Recopilados por el Médico):</strong></p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                <li><strong>Datos Personales de Identificación:</strong> Nombre, cédula de identidad, fecha de nacimiento, sexo, dirección y número de teléfono.</li>
                                <li><strong>Datos de Salud (Categoría de Datos Sensibles bajo la LODP):</strong> Antecedentes patológicos personales y familiares, alergias, motivos de consulta, diagnósticos médicos, recetas farmacológicas, notas de evolución y exámenes médicos.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN III: FINALIDAD DEL TRATAMIENTO DE LOS DATOS</h2>
                            <p>Los datos personales y clínicos recopilados en la Plataforma se procesan única y exclusivamente para los siguientes fines lícitos:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                                <li>Permitir la creación, organización y consulta cronológica de la Historia Clínica Electrónica del paciente por parte de su médico tratante.</li>
                                <li>Agendar, modificar y recordar citas médicas con el paciente.</li>
                                <li>Emitir recetas médicas electrónicas y órdenes de exámenes complementarios de forma ágil y segura.</li>
                                <li>Generar reportes estadísticos internos sobre patologías o atenciones, de uso confidencial y exclusivo para el médico.</li>
                            </ul>
                            <p>Bajo ningún concepto Sicam comercializará, compartirá, transferirá o utilizará la información de los pacientes para fines publicitarios, de marketing o comerciales con terceros.</p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN IV: MEDIDAS DE SEGURIDAD Y ALMACENAMIENTO</h2>
                            <p>La Plataforma implementa estrictas medidas de seguridad técnicas, organizativas y físicas para proteger la confidencialidad, integridad y disponibilidad de la información de salud:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                <li><strong>Encriptación en Tránsito:</strong> Toda transferencia de datos entre el navegador del Usuario y los servidores de la Plataforma se realiza a través de canales seguros y encriptados utilizando el protocolo de seguridad HTTPS (TLS 1.3 / SSL).</li>
                                <li><strong>Encriptación de Base de Datos:</strong> Los datos confidenciales de la base de datos se protegen con controles estrictos de seguridad física e informática en la nube de alta disponibilidad (Render/Cloudflare/PostgreSQL).</li>
                                <li><strong>Control de Acceso Estricto:</strong> Solo el profesional médico titular y el personal auxiliar expresamente autorizado por este tienen acceso visual a las historias clínicas de sus pacientes correspondientes. El personal técnico de soporte de Sicam solo podrá acceder al sistema de base de datos bajo solicitud del médico y bajo estricto acuerdo de confidencialidad de datos personales.</li>
                                <li><strong>Registro de Auditoría (Logs):</strong> El sistema registra las marcas de tiempo e identificadores de qué usuario creó o modificó cada ficha médica o cita.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN V: DERECHOS ARCO DE LOS PACIENTES</h2>
                            <p>Conforme a la LODP de Ecuador, los pacientes tienen derecho a ejercer sus derechos de:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
                                <li><strong>Acceso:</strong> Conocer qué información médica personal se encuentra guardada en el sistema.</li>
                                <li><strong>Rectificación:</strong> Solicitar la corrección de datos personales o de contacto erróneos o desactualizados.</li>
                                <li><strong>Cancelación / Eliminación:</strong> Solicitar la remoción de sus datos de contacto de la base del consultorio (siempre y cuando no colisione con el deber legal del médico de conservar la historia clínica del paciente por los plazos obligatorios fijados por el Ministerio de Salud Pública).</li>
                                <li><strong>Oposición:</strong> Oponerse al tratamiento de ciertos datos personales de carácter no médico.</li>
                            </ul>
                            <p>El paciente podrá ejercer estos derechos comunicándose de forma directa con su profesional de la salud responsable (su médico tratante), quien ejecutará la acción en la Plataforma.</p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN VI: CONSERVACIÓN DE LA HISTORIA CLÍNICA</h2>
                            <p>La historia clínica es un documento privado y obligatorio sometido a reserva legal. La información clínica de los pacientes se conservará en la Plataforma de manera indefinida mientras el profesional médico mantenga activa su licencia de uso de Sicam, o por los plazos de conservación mínimos legales exigidos por las regulaciones del Ministerio de Salud Pública y la legislación aplicable a la práctica médica.</p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>SECCIÓN VII: CONSENTIMIENTO Y ACEPTACIÓN</h2>
                            <p>Al marcar la casilla "Al crear una cuenta aceptas los Términos y Condiciones y nuestra Política de Privacidad", el Usuario certifica bajo juramento que:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                <li>Ha leído, comprendido y aceptado en su totalidad las cláusulas aquí estipuladas.</li>
                                <li>Cuenta con el consentimiento informado explícito (verbal o escrito) de sus pacientes para proceder a registrar y digitalizar sus datos personales y clínicos en esta herramienta de software de conformidad con la Ley.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
