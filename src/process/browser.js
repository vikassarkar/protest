
import { browser, by } from "protractor";

const waitForElement = (selector, waitFor) => {
    waitFor = waitFor || 5000;
    browser.driver.manage().timeouts().implicitlyWait(waitFor);
    browser.driver.findElement(by.css(selector));
    browser.driver.manage().timeouts().implicitlyWait(0);
};

module.exports = waitForElement;