interface Theme {
    name: string;
    colors: [string, string];
}

export const THEMES: Theme[] = [
    
    { name: 'Classic', colors: ['#7C3AED', '#6366F1'] },
    { name: 'Cyberpunk', colors: ['#ff00cc', '#3333ff'] },
    { name: 'Pastel', colors: ['#ffb7b2', '#f9f1e9'] },
    { name: 'Ocean', colors: ['#209CBE', '#51D2F2'] },
    { name: 'Sunset', colors: ['#FF7043', '#FF9F68'] },
    { name: 'Forest', colors: ['#2E7D32', '#4CAF50'] },
    { name: 'Fire', colors: ['#E53935', '#F4511E'] },
    { name: 'Ice', colors: ['#4DD0E1', '#80DEEA'] },
    { name: 'Gold', colors: ['#FFD700', '#FFECB3'] },
    { name: 'Silver', colors: ['#B0BEC5', '#E1E5E8'] },
    { name: 'Purple', colors: ['#9C27B0', '#BA68C8'] },
    { name: 'Pink', colors: ['#EC407A', '#F06292'] },
    { name: 'Teal', colors: ['#00796B', '#26A69A'] },
    { name: 'Indigo', colors: ['#3949AB', '#5C6BC0'] },
    { name: 'Orange', colors: ['#F4511E', '#FF7043'] },
    { name: 'Lime', colors: ['#689F38', '#8BC34A'] },
]