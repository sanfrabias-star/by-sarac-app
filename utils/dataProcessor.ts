import { initialRawData } from '../constants';
import { type Transaction, type Section, type RawTransaction } from '../types';

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getBaseSections = (defaultDate: string): Map<string, Transaction[]> => {
    const sections = new Map<string, Transaction[]>();

    const sectionNames = [
        'Proveedores', 
        'Sueldos', 
        'Gastos Operativos', 
        'Gastos Bancarios',
        'Impuestos',
        'Impuestos Personales', 
        'Gastos Personales', 
        'Tarjetas de Crédito',
        'Gastos Extraordinarios',
        'Retiros Tobi'
    ];

    sectionNames.forEach(name => sections.set(name, []));

    const items: {section: string, description: string}[] = [
        { section: 'Gastos Bancarios', description: 'Descubierto' },
        { section: 'Gastos Bancarios', description: 'Credito 1' },
        { section: 'Gastos Bancarios', description: 'Credito 2' },
        { section: 'Impuestos', description: 'Internet Deposito' },
        { section: 'Impuestos', description: 'Aguas Argentina' },
        { section: 'Impuestos', description: 'Municipal Deposito' },
        { section: 'Impuestos', description: 'Ingresos Brutos' },
        { section: 'Impuestos', description: 'IVA' },
        { section: 'Impuestos', description: 'Aportes y Contribuciones' },
        { section: 'Impuestos', description: 'Moratoria AFIP' },
        { section: 'Impuestos', description: 'Moratoria ARBA' },
        { section: 'Gastos Operativos', description: 'Limpieza Deposito' },
        { section: 'Gastos Operativos', description: 'Agua Dispenser' },
        { section: 'Gastos Operativos', description: 'Supermercado' },
        { section: 'Gastos Operativos', description: 'Libreria' },
        { section: 'Gastos Operativos', description: 'Papelera' },
        { section: 'Gastos Operativos', description: 'Fletes' },
        { section: 'Gastos Operativos', description: 'Viaticos' },
        { section: 'Sueldos', description: 'Empleada 1' },
        { section: 'Sueldos', description: 'Empleada 2' },
        { section: 'Sueldos', description: 'Aguinaldo Emp 1' },
        { section: 'Sueldos', description: 'Aguinaldo Emp 2' },
        { section: 'Impuestos Personales', description: 'Inmobiliario Casa' },
        { section: 'Impuestos Personales', description: 'Moratoria Inmobiliario' },
        { section: 'Impuestos Personales', description: 'Municipal Casa' },
        { section: 'Impuestos Personales', description: 'Moratoria Municipal Casa' },
        { section: 'Impuestos Personales', description: 'Aportes Servicio Limpieza' },
        { section: 'Impuestos Personales', description: 'Patentes Auto Ariel' },
        { section: 'Gastos Personales', description: 'Carniceria' },
        { section: 'Gastos Personales', description: 'Verduleria' },
        { section: 'Gastos Personales', description: 'Sodero' },
        { section: 'Gastos Personales', description: 'Comida Perro' },
    ];
    
    items.forEach((item, index) => {
        const transaction: Transaction = {
            id: `tx_default_${index}_${Date.now()}`,
            description: item.description,
            amount: 0,
            type: 'expense',
            date: defaultDate,
            category: item.section,
            notes: '',
            isPaid: false,
        };
        sections.get(item.section)?.push(transaction);
    });

    return sections;
};

export const createEmptyMonthData = (month: string): { income: number; sections: Section[] } => {
    const [year, monthNum] = month.split('-').map(Number);
    const defaultDate = new Date(year, monthNum - 1, 2).toISOString().split('T')[0];
    const sectionsMap = getBaseSections(defaultDate);

    const result: Section[] = [];
    for (const [name, transactions] of sectionsMap.entries()) {
        const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        result.push({ name, transactions, total });
    }

    return { income: 0, sections: result };
};

export const processInitialData = (): Section[] => {
  const defaultDate = new Date(2025, 9, 2).toISOString().split('T')[0];
  const sections = getBaseSections(defaultDate);
  let currentSectionName = 'Impuestos';

  const supplierNames = [
    "ALQUILER", "JUAN", "ENVASES", "ETIQUETAS", "CAJAS LEO", "LACAPAC", 
    "SILPLAST", "escos", "DIEGO", "credito santander", "DAVID", "DANIELA", 
    "ROTOLAN", "interes descubieeto", "daniel romero"
  ];

  const sectionMapping: { [key: string]: string } = {
    'PROVEEDORES A PAGAR': 'Proveedores',
    'SUELDOS DEPOSITO': 'Sueldos',
    'GASTOS MENSUALES DEPOSITO': 'Gastos Operativos',
    'GASTOS BANCARIOS': 'Gastos Bancarios',
    'IMPUESTOS PARTICULAR ARIEL': 'Impuestos Personales',
    'GASTOS MENSUALES': 'Gastos Personales',
    'TARJETAS DE CREDITO': 'Tarjetas de Crédito',
    'GASTOS EXTRAORDINARIOS': 'Gastos Extraordinarios',
    'IMPUESTOS DEPOSITO': 'Impuestos'
  };

  initialRawData.forEach((row: RawTransaction) => {
    const description = row['IMPUESTOS DEPOSITO'];
    const amount = Number(row['Importe']) || 0;

    if (!description) return;

    const isSectionHeader = amount === 0 && description.toUpperCase() === description && !description.toLowerCase().includes('total');
    
    if (isSectionHeader) {
      currentSectionName = sectionMapping[description] || toTitleCase(description.replace('DEPOSITO', '').trim());
    } else if (amount > 0 && !description.toLowerCase().includes('total')) {
      
      const isSupplier = supplierNames.some(supplier => description.toLowerCase().includes(supplier.toLowerCase()));
      let targetSection = isSupplier ? 'Proveedores' : currentSectionName;
      
      const descriptionLower = description.toLowerCase();
      if (['amex santander rio', 'visa hsbc', 'visa frances', 'visa icbc', 'cencosud', 'mastercard frances', 'visa santander'].includes(descriptionLower)) {
          targetSection = 'Tarjetas de Crédito';
      }
      
      if (descriptionLower === 'regalos' || descriptionLower === 'extras') {
          targetSection = 'Gastos Personales';
      }
      
      if (description.toUpperCase() === 'TOBI') {
        targetSection = 'Retiros Tobi';
      }
      
      const sueldosItemsToRemove = ['dario', 'giuliana', 'nafta tobi', 'agencia', 'otro'];
      if(targetSection === 'Sueldos' && sueldosItemsToRemove.includes(descriptionLower)){
          return;
      }

      const transactionsList = sections.get(targetSection);
      if (transactionsList) {
        transactionsList.push({
          id: `tx_initial_${row.ID}`,
          description: toTitleCase(description),
          amount: amount,
          type: 'expense',
          date: defaultDate,
          category: targetSection,
          notes: typeof row['OBSERVACIONES'] === 'string' ? row['OBSERVACIONES'] : '',
          isPaid: false,
        });
      }
    }
  });

  const result: Section[] = [];
  for (const [name, transactions] of sections.entries()) {
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    result.push({ name, transactions: transactions.sort((a,b) => a.description.localeCompare(b.description)), total });
  }

  return result;
};