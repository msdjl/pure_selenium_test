const TrySqlPage = require('../components/TrySqlPage/TrySqlPage');

// Customer table fields
const fields = {
  CustomerID: 0,
  CustomerName: 1,
  ContactName: 2,
  Address: 3,
  City: 4,
  PostalCode: 5,
  Country: 6,
};
const fieldsArray = Object.keys(fields);

let page;

describe('Try SQL page', () => {
  beforeAll(async () => {
    page = new TrySqlPage(driver);
  });

  beforeEach(async () => {
    await page.go();
    await page.restoreDB();
  });

  // 1. Вывести все строки таблицы Customers и убедиться, что запись с ContactName равной 'Giovanni Rovelli' имеет Address = 'Via Ludovico il Moro 22'.
  it('has a row with ContactName = "Giovanni Rovelli" and Address = "Via Ludovico il Moro 22"', async () => {
    await page.runSQL();
    const giovanni = await page.resultTable.findRowObjectByNthFieldText(fields.ContactName, 'Giovanni Rovelli', fieldsArray);
    expect(giovanni.Address).toEqual("Via Ludovico il Moro 22");
  });

  // 2. Вывести только те строки таблицы Customers, где city='London'. Проверить, что в таблице ровно 6 записей.
  it('shows only 6 rows with City = "London"', async () => {
    await page.runSQL('SELECT * FROM Customers WHERE City = "London";');
    expect(await page.resultTable.getNumberOfRecords()).toEqual(6);
    expect(await page.resultTable.getDeclaredNumberOfRecords()).toEqual(6);
  });

  // 3. Добавить новую запись в таблицу Customers и проверить, что эта запись добавилась.
  it('allows to add a new customer', async () => {
    const expected = {
      CustomerID: '92',
      CustomerName: 'Cardinal',
      ContactName: 'Tom B. Erichsen',
      Address: 'Skagen 21',
      City: 'Stavanger',
      PostalCode: '4006',
      Country: 'Norway',
    };
    await page.runSQL(`INSERT INTO Customers (${Object.keys(expected).slice(1).join(', ')})`
      + ` VALUES (${Object.values(expected).slice(1).map(e => `'${e}'`).join(', ')});`);
    await page.runSQL(`SELECT * FROM Customers WHERE CustomerName = '${expected.CustomerName}';`);

    const newCustomer = await page.resultTable.getRowObjectByIndex(0, fieldsArray);
    expect(newCustomer).toEqual(expected);
    expect(await page.resultTable.getNumberOfRecords()).toEqual(1);
  });

  // 4. Обновить все поля (кроме CustomerID) в любой записи таблицы Customers и проверить, что изменения записались в базу.
  it('allows to update an existing customer', async () => {
    const expected = {
      CustomerID: '1',
      CustomerName: 'Paxful',
      ContactName: 'Aleksandr Pavlov',
      Address: 'Narva mnt 7b',
      City: 'Tallinn',
      PostalCode: '10117',
      Country: 'Estonia',
    };
    await page.runSQL('UPDATE Customers'
      + ` SET ${Object.entries(expected).slice(1).map(v => `${v[0]} = '${v[1]}'`).join(', ')}`
      + ' WHERE CustomerID = 1;');
    await page.runSQL('SELECT * FROM Customers WHERE CustomerID = 1;');

    const updatedCustomer = await page.resultTable.getRowObjectByIndex(0, fieldsArray);
    expect(updatedCustomer).toEqual(expected);
    expect(await page.resultTable.getNumberOfRecords()).toEqual(1);
  });

  // 5. Придумать собственный автотест и реализовать (тут все ограничивается только вашей фантазией).
  it('shows column headers in the first result row', async () => {
    await page.runSQL();
    expect(await page.resultTable.getTableHeaders()).toEqual(fieldsArray);
  });
});


/*
Используя любой язык программирования необходимо написать следующие автотесты для сайта https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
1. Вывести все строки таблицы Customers и убедиться, что запись с ContactName равной 'Giovanni Rovelli' имеет Address = 'Via Ludovico il Moro 22'.
2. Вывести только те строки таблицы Customers, где city='London'. Проверить, что в таблице ровно 6 записей.
3. Добавить новую запись в таблицу Customers и проверить, что эта запись добавилась.
4. Обновить все поля (кроме CustomerID) в любой записи таблицы Customersи проверить, что изменения записались в базу.
5. Придумать собственный автотест и реализовать (тут все ограничивается только вашей фантазией).
Заполнить поле ввода можно с помощью js кода, используя объект window.editor.
Требования:
- Для реализации обязательно использовать Selenium WebDriver
- Код автотестов нужно выложить в любой git-репозиторий
- Тесты должны запускаться в docker контейнере
*/