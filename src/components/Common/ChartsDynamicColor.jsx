const getChartColorsArray = (colors) => {
    let colorsArray = [];

    // Handle if colors are passed as a JSON string
    if (typeof colors === 'string') {
        try {
            colorsArray = JSON.parse(colors);
        } catch (error) {
            console.error("Error parsing colors:", error);
        }
    } else if (Array.isArray(colors)) {
        colorsArray = colors;
    } else {
        console.error("Invalid colors format. Expected a JSON string or an array.");
    }

    return colorsArray.map((value) => {
        var newValue = value.replace(" ", "");
        if (newValue.indexOf(",") === -1) {
            var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);

            if (color.indexOf("#") !== -1)
                color = color.replace(" ", "");
            if (color) return color;
            else return newValue;
        } else {
            var val = value.split(',');
            if (val.length === 2) {
                var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                return rgbaColor;
            } else {
                return newValue;
            }
        }
    });
};

export default getChartColorsArray;
