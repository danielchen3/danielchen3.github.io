import {data_list, state_code, state_name} from "../resources.js"

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

const svgObject = document.getElementById('usaMap');
svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument; 
    const regions_1 = svgDoc.querySelectorAll('path'); 
    const regions_2 = svgDoc.querySelectorAll('polyline');
    
    const regions = [regions_1, regions_2];
    
    regions.forEach(region_ => {
        region_.forEach(region => {
            if (region.id && !region.id.includes("path")) { 
                region.addEventListener('mouseover', () => {
                    region.style.fill = '#FF0000'; 

                    const stateInfo = document.getElementById('stateInfo');
                    stateInfo.style.display = 'block';
                    const processedId = region.id.split('_').slice(3).join(' ');
                    stateInfo.innerHTML = `
                        <h3>${processedId}</h3>
                        ${(() => {
                            const match = Array.from(countyData.entries()).find(([key]) => key.endsWith(processedId));
                            if (match) {
                                const [_, value] = match;
                                return `
                                    <p>Climate Zone: ${value.BA_zone}</p>
                                    <p>State: ${value.state_name}</p>
                                `;
                            }
                            return 'Data not match';
                        })()}
                    `;
                });
                region.addEventListener('mouseout', () => {
                    region.style.fill = ''; 
                });
                region.addEventListener('click', () => {
                    const targetUrl = `https://danielchen3.github.io/usa_map/${region.id}`;
                    window.location.href = targetUrl;
                });
            }
        });
    });
});