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

            this.update();
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
        fetchSelectedCheckboxes() {
            let checkBoxes = this.fetchAllCheckboxes();
            if (checkBoxes.length > 0) {
                checkBoxes = [...checkBoxes];
                return checkBoxes.filter(this.filterByChecked);
            }

            return [];
        }

        /**
         * @param {Array} selectedCheckboxes - An array of all of the checked(selected) checkedboxes 
         * @return {Number} - The number of currently selected checkboxes
         */
        getNumberSelected(selectedCheckboxes) {
            return selectedCheckboxes.length;
        }

        /**
         * Get the total price of all selected stocks
         * @param {Array} selectedCheckboxes - An array of all of the checked(selected) checkedboxes 
         */
        getTotalPrice(selectedCheckboxes) {
            if (selectedCheckboxes.length === 1) {
                return selectedCheckboxes[0].parentElement.data.price;
            } else if (selectedCheckboxes.length > 1) {
                return selectedCheckboxes.reduce((total, checkbox) => {
                    if (typeof(checkbox.parentElement.data.price) !== "number") {
                        throw new Error(`getAveragePrice has an invalid checkbox data price of ${checkbox.data.price}`);
                    }
    
                    if (typeof(total) !== "number") {total = total.parentElement.data.price;}
                    return total + checkbox.parentElement.data.price;
                });
            } else {
                return 0;
            }
        }


        /**
         * Get the average price of all selected stocks
         * @param {Array} selectedCheckboxes - An array of all of the checked(selected) checkedboxes 
         */
        getAveragePrice(selectedCheckboxes) {
            let totalPrice = this.getTotalPrice(selectedCheckboxes);
            if (selectedCheckboxes.length <= 0) {return 0;}

            return Math.round((totalPrice / selectedCheckboxes.length) * 100) / 100;
        }

        /**
         * The companies should already be sorted prior to this function call
         * @param {Array} selectedCheckboxes - An array of all of the checked(selected) checkedboxes 
         * @returns {String} - The name of the stock with the highest price
         */
        getHighestPriceStock(selectedCheckboxes) {
            let company = {
                price: 0,
                name: 'No Stocks Selected'
            };

            selectedCheckboxes.forEach((checkbox) => {
                if (checkbox.parentElement.data.price > company.price) {
                    company.price = checkbox.parentElement.data.price;;
                    company.name = checkbox.parentElement.data.name;
                }
            });

            return company.name;
        }

        updateTableContent() {
            let statTableEl = document.querySelector('.stat-table');

            let colNumberSelected = document.querySelector('.stat-table__number-selected');
            colNumberSelected.innerText = this.numberSelected;
            
            let colTotalPrice = document.querySelector('.stat-table__total-price');
            colTotalPrice.innerText = `$${this.totalPrice}`;

            let colAveragePrice = document.querySelector('.stat-table__average-price');
            colAveragePrice.innerText = `$${this.averagePrice}`;

            let colStockHighestPrice = document.querySelector('.stat-table__height-stock');
            colStockHighestPrice.innerText = this.highestPriceStock;
        }

        update() {

            let selectedCheckboxes = this.fetchSelectedCheckboxes();
            this.numberSelected = this.getNumberSelected(selectedCheckboxes);
            this.totalPrice = this.getTotalPrice(selectedCheckboxes);
            this.averagePrice = this.getAveragePrice(selectedCheckboxes);
            this.highestPriceStock = this.getHighestPriceStock(selectedCheckboxes);

            this.updateTableContent();
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
        tooltipPrice.innerText = `Price: $${company.price}`;

        let tooltipMarketCap = document.createElement('div');
        tooltipMarketCap.classList.add('tooltip--market-cap');
        tooltipMarketCap.innerText = `Market Cap: $${company.marketCap} Billion`;

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
        const maxBarLength = 80;

        let maxMarketCap = undefined;

        let barChartEl = document.createElement('ul');
        barChartEl.classList.add('bar-chart');

        data.forEach((company) => {
            maxMarketCap = (!maxMarketCap) ? company.marketCap : maxMarketCap;
            //let marketCapPercentage = company.marketCap / maxMarketCap * maxBarLength;

            let checkBox = document.createElement('input');
            checkBox.classList.add('check-box');
            checkBox.type = "checkbox";
            checkBox.checked = true;


            let companyName = document.createElement('span');
            companyName.classList.add('company-name');
            companyName.innerText = `${company.name}-`;

            let bar = document.createElement('span');
            bar.classList.add('bar');
            bar.setAttribute('style', `--market-cap: ${company.marketCap}; 
                                       --max-market-cap: ${maxMarketCap}`);
            let entryEl = document.createElement('li');
            entryEl.data = company;
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

        let container = document.querySelector('.bar-chart-container');
        
        // Creates a list of decending order data;
        let dataDecending = data.sort(compareMarketCap).reverse();

        let barChart = generateBarChart(dataDecending);
        container.appendChild(barChart);

        window.addEventListener('resize', (e) => {

        })

        let stateTable = new StatTable();
    }


    init();
})();