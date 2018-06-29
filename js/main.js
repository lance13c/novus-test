(() => {

    const data = [
        {"name": "Apple", "price": 191, "marketCap": 942},
        {"name": "Google", "price": 1130, "marketCap": 791},
        {"name": "Facebook", "price": 189, "marketCap": 556},
        {"name": "Microsoft", "price": 101, "marketCap": 793},
        {"name": "Oracle", "price": 48, "marketCap": 196},
        {"name": "Tesla", "price": 317, "marketCap": 54},
        {"name": "IBM", "price": 146, "marketCap": 133},
        {"name": "Amazon", "price": 1683, "marketCap": 820}
    ];


    class StatTable {
        constructor() {
            this.numberSelected = 0;
            this.totalPrice = 0;
            this.averagePrice = 0;
            this.highestPriceStock = '';

            this.fetchAllCheckboxes().forEach((checkBox) => {
                checkBox.addEventListener('change', () => {
                    this.update();
                });
            });
        }

        /**
         * An filter to check if an HTMLElement is checked. Specifically a checkbox input element.
         * @param {HTMLElement} element 
         */
        filterByChecked(element) {
            return element.checked === true;
        }

        fetchAllCheckboxes() {
            return  document.querySelectorAll(".check-box");
        }

        /**
         * @return {Array} - An array of checkbox elements that are currently checked
         * If there are no currently checked checkboxes then the array will be of length 0;
         */
        fetchCheckboxes() {
            let checkBoxes = this.fetchAllCheckboxes();
            if (checkBoxes.length > 0) {
                checkBoxes = [...checkBoxes];
                return checkBoxes.filter(this.filterByChecked);
            }

            return [];
        }

        getHighestPriceStock() {

        }

        update() {
            console.log(this.fetchCheckboxes());
        }


    }



    /**
     * A compare method used when sorting arrays
     * @param {*} a - first object to compare to
     * @param {*} b - second object to compare to
     */
    function compareMarketCap(a, b) {
        return a.marketCap - b.marketCap;
    }

    /**
     * @param {Object} company - An object that represent company data
     */
    function generateToolTip(company) {
        `<div class="tooltip">
        <div class="tooltip--price">Price: $109</div>
        <div class="tooltip--market-cap">Market Cap: $3489 Billion</div>
    </div>`

        let tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');

        let dataContainer = document.createElement('div');
        dataContainer.classList.add('data-container');

        let tooltipPrice = document.createElement('div');
        tooltipPrice.classList.add('tooltip--price');
        tooltipPrice.innerText = `Price: ${company.price}`;

        let tooltipMarketCap = document.createElement('div');
        tooltipMarketCap.classList.add('tooltip--market-cap');
        tooltipMarketCap.innerText = `Market Cap: $${company.marketCap}`;

        dataContainer.appendChild(tooltipPrice);
        dataContainer.appendChild(tooltipMarketCap);

        tooltip.appendChild(dataContainer);

        return tooltip;
    }

    /**
     * Creates and appends bars for the barchart
     * @param {Array} data - An array of sorted object that represent company data
     */
    function generateBarChart(data) {
        // Max bar length in percentage 
        const maxBarLength = 60;

        let maxMarketCap = undefined;

        let barChartEl = document.createElement('ul');
        barChartEl.classList.add('bar-chart');

        data.forEach((company) => {
            maxMarketCap = (!maxMarketCap) ? company.marketCap : maxMarketCap;
            let marketCapPercentage = company.marketCap / maxMarketCap * maxBarLength;

            let checkBox = document.createElement('input');
            checkBox.classList.add('check-box');
            checkBox.type = "checkbox";
            checkBox.checked = true;


            let companyName = document.createElement('span');
            companyName.classList.add('company-name');
            companyName.innerText = `${company.name}-`;

            let bar = document.createElement('span');
            bar.classList.add('bar');
            bar.setAttribute('style', `width: ${marketCapPercentage}%`);   

            let entryEl = document.createElement('li');
            entryEl.appendChild(checkBox);
            entryEl.appendChild(companyName);
            entryEl.appendChild(bar);

            let tooltip = generateToolTip(company);
            entryEl.appendChild(tooltip);

            barChartEl.appendChild(entryEl);
        });

        return barChartEl;
    }



    function init() {

        let container = document.querySelector('.container');
        
        // Creates a list of decending order data;
        let dataDecending = data.sort(compareMarketCap).reverse();

        let barChart = generateBarChart(dataDecending);
        container.appendChild(barChart);

        let stateTable = new StatTable();
        
        console.log(stateTable.fetchCheckboxes());
    }


    init();
})();