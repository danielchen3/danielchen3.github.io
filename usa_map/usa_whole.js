import  {Create_State_Chart} from './util.js';
import {state_abbr} from './resources.js'
const targetStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]; // 替换为你需要的州 ID

const test_data_pattern1 = {
    "2025.1.10": 1,
    "2025.1.11": 2,
    "2025.1.12": 4,
    "2025.1.13": 5,
    "2025.1.14": 1,
    "2025.1.15": 19,
    "2025.1.16": 18,
    "2025.1.17": 4,
    "2025.1.18": 2,
    "2025.1.19": 4,
};

const test_data_pattern2 = {
    "2025.1.10": 7,
    "2025.1.11": 10,
    "2025.1.12": 4,
    "2025.1.13": 1,
    "2025.1.14": 1,
    "2025.1.15": 2,
    "2025.1.16": 8,
    "2025.1.17": 2,
    "2025.1.18": 9,
    "2025.1.19": 13,
};
function getRandomPattern(pattern1, pattern2) {
    return Math.random() < 0.5 ? pattern1 : pattern2;
}

const svgObject = document.getElementById('usaMap');
svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument; 
    const states = svgDoc.querySelectorAll('path'); 
    

    // 遍历每个州，并添加交互
    states.forEach(state => {
        if (targetStates.includes(state.id)) { 
            state.addEventListener('mouseover', () => {
                state.style.fill = '#FF0000'; 

                // state information and extra interaction
                const stateInfo = document.getElementById('stateInfo');
                stateInfo.style.display = 'block';
                stateInfo.innerHTML = `
                    <h3>${state.id}</h3>
                    <p>Information about ${state_abbr[state.id]}</p>
                    <div style="width: 100%; height: 300px;">
                        <canvas id="tempChart"></canvas>
                    </div>
                `;
                Create_State_Chart('tempChart', getRandomPattern(test_data_pattern1, test_data_pattern2) , 'Alerts Count');
            });
            state.addEventListener('mouseout', () => {
                state.style.fill = '#FFFFFF'; 
            });
            state.addEventListener('click', () => {
                const targetUrl = `https://danielchen3.github.io/usa_map/${state.id}`; 
                window.location.href = targetUrl; 
            });
        }
    });
});
