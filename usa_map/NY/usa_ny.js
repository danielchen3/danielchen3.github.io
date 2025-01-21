import {data_list, state_code, state_name} from "../resources.js"
import {Create_County_Chart} from "../util.js"

// async function processData() {
//     const querySnapshot = await data_list;
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
//     });
// }
let countyData = new Map();
async function get_corresponding_regions(){
    const name = document.title;
    console.log("title is ", name);
    const abbr = state_name[name];
    console.log("state_abbr is ", abbr); 
    const code = state_code[abbr];
    console.log("state_code is ",code);
    const all_coutry_regions = await data_list;
    all_coutry_regions.forEach((doc) => {
        const fullId = doc.id;
        const statePrefix = fullId.slice(0, -3);
        
        // if match
        if (statePrefix === String(code)) {
            console.log(`找到匹配: ${doc.id} => ${JSON.stringify(doc.data())}`);
            const data = doc.data();
            const BA_zone = data['BA Climate Zone'];
            const county_name = data['county name'];
            const state_name = data['state name'];
            countyData.set(county_name, {
                "BA_zone": BA_zone,
                "state_name":state_name
            });
            console.log(`找到匹配: ${fullId} => BA Climate Zone: ${BA_zone}`);
        }
    });
}
get_corresponding_regions();

const test_data_pattern1 = {
    "2025.1.10": 1,
    "2025.1.11": 0,
    "2025.1.12": 1,
    "2025.1.13": 1,
    "2025.1.14": 0,
    "2025.1.15": 0,
    "2025.1.16": 0,
    "2025.1.17": 0,
    "2025.1.18": 1,
    "2025.1.19": 1,
};

const test_data_pattern2 = {
    "2025.1.10": 0,
    "2025.1.11": 0,
    "2025.1.12": 1,
    "2025.1.13": 0,
    "2025.1.14": 1,
    "2025.1.15": 1,
    "2025.1.16": 1,
    "2025.1.17": 0,
    "2025.1.18": 0,
    "2025.1.19": 0,
};

function getRandomPattern(pattern1, pattern2) {
    return Math.random() < 0.5 ? pattern1 : pattern2;
}


const targetRegions = ["Bronx", "Suffolk", "Westchester","New York"];
const svgObject = document.getElementById('usaMap');
svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument; 
    const paths = svgDoc.querySelectorAll('path'); 
    const regions = svgDoc.querySelectorAll('polygon'); 
    
    regions.forEach(region => {
        if (region.id && !region.id.includes("path")) {
            region.addEventListener('mouseover', (e) => {
                region.style.fill = '#FF0000'; 
            
                const stateInfo = document.getElementById('stateInfo');
                stateInfo.style.display = 'block';
                const processedId = region.id.substring(region.id.lastIndexOf('_') + 1);
                stateInfo.innerHTML = `
                    <h3>${processedId}</h3>
                    ${(() => {
                        const match = Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId));
                        if (match) {
                            const [_, value] = match;
                            return `
                                <p>Climate Zone: ${value.BA_zone}</p>
                                <p>State: ${value.state_name}</p>
                                <div style="width: 100%; height: 200px;">
                                    <canvas id="tempChart"></canvas>
                                </div>
                            `;
                        }
                        return 'Data not match';
                    })()}
                `;
                // 如果找到匹配数据，创建图表
                if (Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId))) {
                    Create_County_Chart('tempChart', getRandomPattern(test_data_pattern1, test_data_pattern2), 'County Alert Trend');
                }
                // const tooltip = document.getElementById('tooltip');
                // console.log("get tooltip", tooltip);
                // tooltip.style.display = 'block';
                // tooltip.style.left = e.pageX + 10 + 'px';
                // tooltip.style.top = e.pageY + 10 + 'px';
                // tooltip.innerHTML = `
                //     <h3>${processedId}</h3>
                //     ${(() => {
                //         const match = Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId));
                //         if (match) {
                //             const [_, value] = match;
                //             return `
                //                 <p>Climate Zone: ${value.BA_zone}</p>
                //                 <p>State: ${value.state_name}</p>
                //             `;
                //         }
                //         return 'Data not match';
                //     })()}
                // `;
                
            });
            region.addEventListener('mouseout', () => {
                region.style.fill = ''; 
                // document.getElementById('tooltip').style.display = 'none';
            });
            region.addEventListener('click', () => {
                const targetUrl = `https://danielchen3.github.io/usa_map/${region.id}`;
                window.location.href = targetUrl;
            });
        }
    });

    paths.forEach(path => {
        if (path.id && !path.id.includes("path") && targetRegions.includes(path.id)) { 
            path.addEventListener('mouseover', () => {
                path.style.fill = '#FF0000';

            
                const stateInfo = document.getElementById('stateInfo');
                stateInfo.style.display = 'block';
                const processedId = path.id;
                stateInfo.innerHTML = `
                    <h3>${processedId}</h3>
                    ${(() => {
                        const match = Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId));
                        if (match) {
                            const [_, value] = match;
                            return `
                                <p>Climate Zone: ${value.BA_zone}</p>
                                <p>State: ${value.state_name}</p>
                                <div style="width: 100%; height: 200px;">
                                    <canvas id="tempChart"></canvas>
                                </div>
                            `;
                        }
                        return 'Data not match';
                    })()}
                `;
                if (Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId))) {
                    Create_County_Chart('tempChart', getRandomPattern(test_data_pattern1, test_data_pattern2), 'County Alert Trend');
                }
            });
            path.addEventListener('mouseout', () => {
                path.style.fill = ''; 
            });
            path.addEventListener('click', () => {
                const targetUrl = `https://danielchen3.github.io/usa_map/${path.id}`; 
                window.location.href = targetUrl; 
            });
        }
    });
});