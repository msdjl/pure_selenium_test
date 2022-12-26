const { By, until } = require('selenium-webdriver');

class QueryResultTable {
  driver;
  locators = {
    wrapper: By.css('#divResultSQL'),
  };

  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Count table rows excluding header line
   * @returns {number}
  */
  async getNumberOfRecords() {
    const trs = await this.driver.findElement(this.locators.wrapper).findElements(By.css('tr'));
    return trs.length - 1;
  }

  /**
   * Get the "Number of Records: x" number value
   * @returns {number}
  */
  async getDeclaredNumberOfRecords() {
    const text = await this.driver.findElement(this.locators.wrapper)
      .findElement(By.xpath('.//div[starts-with(text(), "Number of Records:")]')).getText();
    return +text.split(' ').at(-1);
  }

  /**
   * Find a tr element by nth td text value
   * @param {number} n - Index of column to search by
   * @param {string} text - Text to search
   * @returns {WebElementPromise}
  */
  async findRowByNthFieldText(n, text) {
    return await this.driver.findElement(this.locators.wrapper)
        .findElement(By.xpath(`.//tr[td[${n + 1}]/text() = "${text}"]`));
  }

  /**
   * Convert a tr element of a result row to a data object with named fields
   * @param {WebElement} row - <tr> element of the table row
   * @param {string[]} fields - Array of object fields names
   * @returns {Object}
   */
  async convertResultRowToObject(row, fields) {
    const obj = {};
    for (const [i, td] of (await row.findElements(By.css('td'))).entries()) {
        obj[fields[i]] = await td.getText();
    }
    return obj;
  }

  /**
   * Get an array of column headers strings
   * @returns {string[]}
   */
  async getTableHeaders() {
    const tr = await this.driver.findElement(this.locators.wrapper)
      .findElement(By.xpath(`.//tr[1]`));
    const tds = await tr.findElements(By.css('th'));
    return await Promise.all(tds.map(async td => await td.getText()));
  }

  /**
   * Take a row by index and convert to a data object with {@link convertResultRowToObject}
   * @param {number} index 
   * @param {string[]} fields 
   * @returns {string[]}
   */
  async getRowObjectByIndex(index, fields) {
    const tr = await this.driver.findElement(this.locators.wrapper)
        .findElement(By.xpath(`.//tr[${index + 2}]`));
    return await this.convertResultRowToObject(tr, fields);
  }

  /**
   * Find a row by text using {@link findRowByNthFieldText} and convert to object with {@link convertResultRowToObject}
   * @param {number} n - Index of a column to search by
   * @param {string} text - Text to search for
   * @param {string[]} fields - Array of object fields names
   * @returns {Object}
   */
  async findRowObjectByNthFieldText(n, text, fields) {
    const tr = await this.findRowByNthFieldText(n, text);
    return await this.convertResultRowToObject(tr, fields);
  }
}

module.exports = QueryResultTable;