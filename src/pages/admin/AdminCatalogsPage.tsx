import { useState } from 'react';
import CatalogItemList from '../../components/admin/CatalogItemList';
import { Archive } from 'lucide-react';

export type CatalogType = 
  | 'FAMILY_HISTORY'
  | 'VACCINE'
  | 'RISK_FACTOR'
  | 'RELATION'
  | 'TOXIC_HABIT_FREQUENCY'
  | 'MEAL_TIME'
  | 'FOOD_GROUP';

const CATALOG_TABS: { label: string; value: CatalogType }[] = [
  { label: 'Antecedentes Familiares', value: 'FAMILY_HISTORY' },
  { label: 'Vacunas', value: 'VACCINE' },
  { label: 'Factores de Riesgo', value: 'RISK_FACTOR' },
  { label: 'Parentescos', value: 'RELATION' },
  { label: 'Frecuencia Tóxica', value: 'TOXIC_HABIT_FREQUENCY' },
  { label: 'Tiempos de Comida', value: 'MEAL_TIME' },
  { label: 'Grupos de Alimentos', value: 'FOOD_GROUP' },
];

export default function AdminCatalogsPage() {
  const [activeTab, setActiveTab] = useState<CatalogType>('FAMILY_HISTORY');

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Archive color="var(--primary)" />
            Gestión de Catálogos
          </h1>
          <p style={{ color: 'var(--text-gray)', marginTop: '4px', fontSize: '14px' }}>
            Administra los elementos que aparecen en los desplegables de las historias clínicas.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar tabs for catalogs */}
        <div style={{ width: '280px', flexShrink: 0, backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {CATALOG_TABS.map((tab) => (
              <li key={tab.value} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 20px',
                    backgroundColor: activeTab === tab.value ? '#f0f4ff' : 'transparent',
                    color: activeTab === tab.value ? 'var(--primary)' : 'var(--text-gray)',
                    border: 'none',
                    borderLeft: `4px solid ${activeTab === tab.value ? 'var(--primary)' : 'transparent'}`,
                    cursor: 'pointer',
                    fontWeight: activeTab === tab.value ? 600 : 500,
                    transition: 'all 0.2s ease',
                    fontSize: '14px'
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* List of items */}
        <div style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', padding: 0, backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
          <CatalogItemList type={activeTab} />
        </div>
      </div>
    </div>
  );
}
