describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500');
    await page.waitForTimeout(500);
  });

  // test 1 is given
  it('Test1: Initial Home Page - Check for 10 Journal Entries', async () => {
    const numEntries = await page.$$eval('journal-entry', (entries) => {
      return entries.length;
    });
    expect(numEntries).toBe(10);
  });

  // test 2 is given
  it('Test2: Make sure <journal-entry> elements are populated', async () => {
    let allArePopulated = true;
    let data, plainValue;
    const entries = await page.$$('journal-entry');
    for (let i = 0; i < entries.length; i++) {
      data = await entries[i].getProperty('entry');
      plainValue = await data.jsonValue();
      if (plainValue.title.length == 0) { allArePopulated = false; }
      if (plainValue.date.length == 0) { allArePopulated = false; }
      if (plainValue.content.length == 0) { allArePopulated = false; }
    }
    expect(allArePopulated).toBe(true);
  }, 30000);

  it('Test3: Clicking first <journal-entry>, new URL should contain /#entry1', async () => {
    // implement test3: Clicking on the first journal entry should update the URL to contain “/#entry1”
    await page.click('journal-entry');
    let url = await page.url();
    expect(url.includes('/#entry1')).toBeTruthy();
  });

  it('Test4: On first Entry page - checking page header title', async () => {
    // implement test4: Clicking on the first journal entry should update the header text to “Entry 1” 
    let title = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(title).toBe('Entry 1');
  });

  it('Test5: On first Entry page - checking <entry-page> contents', async () => {
    /*
     implement test5: Clicking on the first journal entry should contain the following contents: 
        { 
          title: 'You like jazz?',
          date: '4/25/2021',
          content: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
          image: {
            src: 'https://i1.wp.com/www.thepopcornmuncher.com/wp-content/uploads/2016/11/bee-movie.jpg?resize=800%2C455',
            alt: 'bee with sunglasses'
          }
        }
      */
    const entry = await page.$('entry-page');
    const values = await(await entry.getProperty('entry')).jsonValue();
    expect(values.title).toBe('You like jazz?');
    expect(values.date).toBe('4/25/2021');
    expect(values.content).toBe("According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.");
    expect(values.image.src).toBe('https://i1.wp.com/www.thepopcornmuncher.com/wp-content/uploads/2016/11/bee-movie.jpg?resize=800%2C455');
    expect(values.image.alt).toBe('bee with sunglasses');
  }, 10000);

  it('Test6: On first Entry page - checking <body> element classes', async () => {
    // implement test6: Clicking on the first journal entry should update the class attribute of <body> to ‘single-entry’
    const classes = await page.$eval('body', (element) => {
      return element.classList;
    });
    expect(classes[0]).toBe('single-entry');
  });

  it('Test7: Clicking the settings icon, new URL should contain #settings', async () => {
    // implement test7: Clicking on the settings icon should update the URL to contain “/#settings”
    await page.click('header > img');
    const url = page.url();
    expect(url.includes('/#settings')).toBeTruthy();
  });

  it('Test8: On Settings page - checking page header title', async () => {
    // implement test8: Clicking on the settings icon should update the header to be “Settings”
    const headerTitle = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(headerTitle).toBe('Settings');
  });

  it('Test9: On Settings page - checking <body> element classes', async () => {
    // implement test9: Clicking on the settings icon should update the class attribute of <body> to ‘settings’
    const classes = await page.$eval('body', (element) => {
      return element.classList;
    });
    expect(classes[0]).toBe('settings');
  });

  it('Test10: Clicking the back button, new URL should be /#entry1', async() => {
    // implement test10: Clicking on the back button should update the URL to contain ‘/#entry1’
    await page.goBack();
    const url = await page.url();
    expect(url.includes('/#entry1')).toBeTruthy();
  });

  // define and implement test11: Clicking the back button once should bring the user back to the home page
  it('test11: check back button', async() => {
    await page.goBack();
    const url = await page.url();
    expect(url).toBe('http://127.0.0.1:5500/');
  });

  // define and implement test12: When the user if on the homepage, the header title should be “Journal Entries”
  it('test12: home page is Journal Entries', async() => {
    const headerTitle = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(headerTitle).toBe('Journal Entries');
  });

  // define and implement test13: On the home page the <body> element should not have any class attribute 
  it('test13: classless body', async() => {
    const bodyLength = await page.$eval('body', (body) => {
      return body.classList.length;
    });
    expect(bodyLength).toEqual(0);
  });

  // define and implement test14: Verify the url is correct when clicking on the second entry
  it('test14: verify correct url for second entry', async() => {
    const second = await page.click('journal-entry:nth-child(2)');
    const url = await page.url();
    expect(url.includes('/#entry2')).toBeTruthy();
  });

  // define and implement test15: Verify the title is current when clicking on the second entry
  it('test15: verify title for second', async() => {
    const headerTitle = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(headerTitle).toBe('Entry 2');
  });

  // define and implement test16: Verify the entry page contents is correct when clicking on the second entry
  it('test16: verify entry page contents correct for second', async() => {
    const entries = await page.$$('journal-entry');
    let second = entries[1];
    let data = await second.getProperty('entry');
    let values  = await data.jsonValue();
    expect(values.title).toBe('Run, Forrest! Run!');
    expect(values.date).toBe('4/26/2021'); 
    expect(values.content).toBe("Mama always said life was like a box of chocolates. You never know what you're gonna get.");
    expect(values.image.src).toBe('https://s.abcnews.com/images/Entertainment/HT_forrest_gump_ml_140219_4x3_992.jpg');
    expect(values.image.alt).toBe('forrest running');
    expect(data.audio).toBeUndefined();
  });

  // create your own test 17
  it('test17: verify url correct for third', async() => {
    page.goBack();
    const third = await page.click('journal-entry:nth-child(3)');
    const url = await page.url();
    expect(url.includes('/#entry3')).toBeTruthy();
  });
  // create your own test 18
  it('test18: verify correct title for third', async() => {
    const headerTitle = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(headerTitle).toBe('Entry 3');
  });
  // create your own test 19
  it('test19: verify correct url for fourth', async() => {
    page.goBack();
    const fourth = await page.click('journal-entry:nth-child(4)');
    const url = await page.url();
    expect(url.includes('/#entry4')).toBeTruthy();
  });
  // create your own test 20
  it('test20: verify correct title for fourth', async() => {
    const headerTitle = await page.$eval('header > h1', (header) => {
      return header.innerHTML;
    });
    expect(headerTitle).toBe('Entry 4');
  });
});
