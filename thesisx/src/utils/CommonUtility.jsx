const departments = [
    { label: 'Architecture', value: 'ARC' },
    { label: 'Computer Science and Engineering', value: 'CSE' },
    { label: 'Economics and Social Sciences', value: 'ECO_SSC' },
    { label: 'Electrical and Electronic Engineering', value: 'EEE' },
    { label: 'English and Humanities', value: 'ENG_HUM' },
    { label: 'Mathematics and Natural Sciences', value: 'MNS' },
    { label: 'Pharmacy', value: 'PHR' },
];

const getLabelByValue = (value) => {
    const department = departments.find((dept) => dept.value === value);
    return department ? department.label : null; // Return the label if found, otherwise return null
};


export { getLabelByValue }