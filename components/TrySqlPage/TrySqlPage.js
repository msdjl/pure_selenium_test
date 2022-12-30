const { By, until } = require('selenium-webdriver');
const QueryResultTable = require('./QueryResultTable');
const config = require('../../config');

class TrySqlPage {
  driver;
  resultTable;

  constructor(driver) {
    this.driver = driver;
    this.resultTable = new QueryResultTable(driver);
  }
  
  /** Open the Try SQL page by URL */
  async go() {
    await this.driver.get(config.baseUrl + '/sql/trysql.asp?filename=trysql_select_all');
  }

  /** Click Restore Database button and confirm restoration */
  async restoreDB() {
    await this.driver.findElement(By.id('restoreDBBtn')).click();
    await this.driver.wait(until.alertIsPresent());
    await this.driver.switchTo().alert().accept();
    await this.driver.switchTo().defaultContent();
    // wait for alert animation to complete. is there a better way?
    await this.driver.sleep(200);
  }

  /**
   * Click Run SQL button, optionally set new SQL statement text using {@link setStatement}
   * @param {string} [sql] - SQL statement text
   */
  async runSQL(sql) {
    if (sql !== undefined) {
      await this.setStatement(sql);
    }
    await this.driver.findElement(By.css('.ws-btn')).click();
    await this.driver.sleep(50);
  }

  /**
   * Set new SQL statement text
   * @param {string} sql - SQL statement text
   */
  async setStatement(sql) {
    await this.driver.executeScript((sql) => {
      window.editor.setValue(sql);
    }, sql);
  }
}

module.exports = TrySqlPage;