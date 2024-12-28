import { format, isToday, isYesterday } from 'date-fns';

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

const ConvertToReadableDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toDateString();
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
        return format(date, 'p'); // 'p' is for time with AM/PM
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else {
        return format(date, 'MMM dd'); // 'MMM dd' is for date like Dec 23
    }
};

export { getLabelByValue, ConvertToReadableDate, formatDate };