export const GET_CHART_DATA = "GET_CHART_DATA";
export const getChartData =
    (token0, token1, day, interval) => async (dispatch) => {
        let prices = [];
        try {
            if (token0.apiId === "bnb" || token1.apiId === "bnb") {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${token0.apiId === "bnb" ? token1.apiId : token0.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                let res = await response.json();
                if (token1.apiId !== "bnb") {
                    prices = res['prices'].map(array => [array[0], 1 / array[1]]);
                } else {
                    prices = res['prices'];
                }
            } else {
                const resp1 = await fetch(`https://api.coingecko.com/api/v3/coins/${token0.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                const resp2 = await fetch(`https://api.coingecko.com/api/v3/coins/${token1.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                const res1 = await resp1.json();
                const res2 = await resp2.json();
                prices = res1['prices'].map((array, i) => [array[0], array[1] / res2['prices'][i][1]]);
            }
        } catch (error) {
            console.error('Failed to fetch chart data', error);
        }
        dispatch({ type: GET_CHART_DATA, payload: { prices } });
    };
