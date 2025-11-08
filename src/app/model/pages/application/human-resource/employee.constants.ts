export namespace EmployeeConstants {
    /**
     * Tax Method Options
     * - gross: Pajak dihitung dari gaji bruto
     * - net: Pajak dihitung dari gaji neto
     * - gross-up: Pajak ditanggung perusahaan
     */
    export const TAX_METHODS = [
        { label: 'Gross', value: 'gross', description: 'Pajak dihitung dari gaji bruto' },
        { label: 'Net', value: 'net', description: 'Pajak dihitung dari gaji neto' },
        { label: 'Gross-up', value: 'gross-up', description: 'Pajak ditanggung perusahaan' }
    ];

    /**
     * Tax PTKP Type Options (Penghasilan Tidak Kena Pajak)
     * Kategori PTKP berdasarkan status perkawinan dan tanggungan
     */
    export const TAX_PTKP_TYPES = [
        { label: 'TK0', value: 'TK0', description: 'Tidak Kawin' },
        { label: 'K0', value: 'K0', description: 'Kawin, tanpa tanggungan' },
        { label: 'K1', value: 'K1', description: 'Kawin, 1 tanggungan' },
        { label: 'K2', value: 'K2', description: 'Kawin, 2 tanggungan' },
        { label: 'K3', value: 'K3', description: 'Kawin, 3 tanggungan' }
    ];
}

