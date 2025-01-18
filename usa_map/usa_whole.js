const targetStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]; // 替换为你需要的州 ID

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
                    <p>这里是关于 ${state.id} 的详细信息</p>
                `;
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