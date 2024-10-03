let activeNatureFilters = [];
let activeTechnologyFilters = [];
let activeToolsFilters = [];

function populateFilter( elements, filter_type) {
    const FilterSelect = document.getElementById(filter_type);
    const FilterSet = new Set();
    let filteredElements=[];
    if(filter_type != "nature-filter")
    {
        filteredElements = elements.filter(element => {
            return activeNatureFilters.length === 0 || 
            element.natures.some(nature => activeNatureFilters.includes(nature));
        });
        

        if(filter_type == "tools-filter")
        {
            filteredElements = filteredElements.filter(element => {
                return activeTechnologyFilters.length === 0 || 
                element.technologies.some(technologie => activeTechnologyFilters.includes(technologie));
            });
            filteredElements.forEach(element => {
                if (element.tools) {
                    element.tools.forEach(tool => {
                        FilterSet.add(tool);
                    });
                }
            });
        }
        else
        {
            filteredElements.forEach(element => {
                if (element.technologies) {
                    element.technologies.forEach(tech => {
                        FilterSet.add(tech);
                    });
                }
            });
        }
    }
    else
    {
        elements.forEach(element => {
            if (element.natures) {
                element.natures.forEach(nature => {
                    FilterSet.add(nature);
                });
            }
        });
    }
    FilterSelect.innerHTML = '<option value="">Select ' +filter_type.split("-")[0]+'</option>';
    
    Array.from(FilterSet).sort().forEach(tech => {
        const option = document.createElement("option");
        option.value = tech;
        option.textContent = tech;
        FilterSelect.appendChild(option);
    });
    updateCharts(filteredElements)
}

