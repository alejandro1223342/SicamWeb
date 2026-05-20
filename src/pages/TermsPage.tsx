import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                    
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', marginBottom: '24px' }}>Términos y Condiciones de Uso</h1>
                    
                    <div style={{ color: '#475569', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p>Última actualización: 19 de mayo de 2026</p>
                        <p>Bienvenido a Sicam. Los presentes Términos y Condiciones de Uso (en adelante, los "Términos") regulan el acceso y uso de la plataforma de software Sicam (en adelante, la "Plataforma"), diseñada para la gestión médica, agendamiento de citas, registro de pacientes y almacenamiento de historias clínicas electrónicas.</p>
                        <p>Al crear una cuenta, registrarse o utilizar la Plataforma, usted (en adelante, el "Usuario", el cual incluye a médicos, profesionales de la salud, asistentes y personal autorizado) acepta de manera expresa, voluntaria e incondicional someterse a estos Términos. Si no está de acuerdo con ellos, deberá abstenerse de utilizar la Plataforma.</p>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA PRIMERA: OBJETO DEL SERVICIO</h2>
                            <p>Sicam es una plataforma tecnológica que provee un sistema cerrado e integrado de software como servicio (SaaS) con las siguientes funcionalidades:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                <li><strong>Agendamiento y Gestión de Citas:</strong> Programación, control y visualización de citas de consulta médica.</li>
                                <li><strong>Registro de Pacientes:</strong> Fichas filiatorias con información de identificación personal y contacto de los pacientes.</li>
                                <li><strong>Historia Clínica Electrónica:</strong> Módulos para el registro de antecedentes, sintomatología, diagnósticos, evolución clínica, recetas y exámenes complementarios.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA SEGUNDA: CAPACIDAD Y REGISTRO DE CUENTAS</h2>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Uso Profesional Exclusivo:</strong> El acceso a los módulos de registro clínico está reservado exclusivamente para profesionales de la salud debidamente autorizados, acreditados y con licencia de ejercicio profesional vigente otorgada por las autoridades sanitarias de su jurisdicción (ej. ACESS en Ecuador).</li>
                                <li><strong>Confidencialidad de Credenciales:</strong> El Usuario es el único responsable de mantener la estricta confidencialidad de su nombre de usuario, contraseña y tokens de acceso. Cualquier actividad realizada bajo su cuenta se presumirá efectuada por el Usuario, quien asumirá la responsabilidad civil, administrativa o penal derivada de un uso indebido de sus credenciales.</li>
                                <li><strong>Prohibición de Uso Compartido:</strong> Queda estrictamente prohibido compartir credenciales de acceso entre profesionales de la salud. Cada Usuario debe contar con su propia cuenta y credenciales individuales por motivos de auditoría y seguridad de datos médicos.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA TERCERA: RESPONSABILIDAD PROFESIONAL MÉDICA</h2>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Herramienta de Apoyo Tecnológico:</strong> El Usuario reconoce y acepta que Sicam es exclusivamente una herramienta tecnológica de soporte y almacenamiento. La Plataforma no emite diagnósticos, no sugiere tratamientos ni reemplaza bajo ningún concepto el criterio clínico del profesional de la salud.</li>
                                <li><strong>Exactitud de la Información:</strong> El profesional de la salud es el único responsable de la veracidad, exactitud y completitud de la información registrada en la Historia Clínica de cada paciente.</li>
                                <li><strong>Exclusividad Legal:</strong> El Usuario exime a Sicam y a sus desarrolladores de cualquier tipo de responsabilidad civil derivada de mala práctica médica, diagnósticos erróneos, tratamientos inadecuados o cualquier decisión clínica adoptada por el profesional utilizando los datos almacenados en el sistema.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA CUARTA: PROPIEDAD INTELECTUAL</h2>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Titularidad del Software:</strong> Todos los derechos de propiedad intelectual sobre el código fuente, diseño de interfaz, bases de datos, logotipos, marcas y metodologías de Sicam pertenecen exclusivamente a sus creadores/desarrolladores.</li>
                                <li><strong>Licencia de Uso:</strong> Se otorga al Usuario una licencia no exclusiva, intransferible y de uso limitado a la operatividad del sistema bajo los planes contratados. Queda prohibida la reproducción, descompilación, ingeniería inversa o copia del software.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA QUINTA: DISPONIBILIDAD Y LIMITACIÓN DE GARANTÍAS</h2>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                <li><strong>Garantía de Servicio:</strong> Sicam realiza sus mejores esfuerzos para garantizar una disponibilidad de la Plataforma del 99.9% bajo servidores de alta disponibilidad y nube segura (Render/PostgreSQL). No obstante, el Usuario acepta que el servicio puede sufrir interrupciones temporales debido a tareas de mantenimiento programado, fallas imprevistas de infraestructura de red global o causas de fuerza mayor.</li>
                                <li><strong>Copia de Respaldo Externa:</strong> Se recomienda al Usuario realizar descargas periódicas de sus reportes consolidados o copias de seguridad de sus historias clínicas autorizadas por ley en sus formatos locales para cumplir con sus obligaciones legales de respaldo físico si fuesen requeridas.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>CLÁUSULA SEXTA: SUSPENSIÓN Y TERMINACIÓN</h2>
                            <p>Sicam se reserva el derecho de suspender o rescindir el acceso del Usuario a la Plataforma de manera inmediata y sin previo aviso en caso de:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                <li>Violación grave a las normas de confidencialidad de datos de salud de los pacientes.</li>
                                <li>Intento de vulneración tecnológica, inyección de malware o denegación de servicio a los servidores del sistema.</li>
                                <li>Incumplimiento en los pagos periódicos del servicio contratado.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
