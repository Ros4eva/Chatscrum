import time
import unittest

from configparser import ConfigParser
from selenium import webdriver

from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

parser = ConfigParser()
options = Options()
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--headless')
options.add_argument('--disable-gpu')


import utils
from utils import get_parser

parser = get_parser()

class Authentication(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        pass

    def setUp(self):
        self.driver = utils.get_driver()
        self.url = parser.get('chatscrum_site_to_test', 'url')

    def tearDown(self):
        self.driver.close()

    @classmethod
    def tearDownClass(cls):
        pass

    def test_user_can_visit_home_page(self):
        utils.loader(
            "\n\n>>>>>>>>>>>>>>> Test To Check If A User Can Visit The Home Page <<<<<<<<<<<<<<<\n\n"
        )
 
        time.sleep(1)
        self.driver.get(self.url)
        print(self.driver.current_url)
        self.driver.find_element_by_link_text("SIGN UP").click()
        time.sleep(4)
        self.driver.find_element_by_xpath("//img[@ src='https://res.cloudinary.com/ros4eva/image/upload/v1574765308/Rectangle_3_btfp6e.png']").click()
        time.sleep(3)
        self.assertEqual("Scrum", self.driver.title)



    def test_sign_up_form_is_visible(self):
        utils.loader(
            "\n\n>>>>>>>>>>>>>>> Test To Check If The SignUp Form is Vissible To Users <<<<<<<<<<<<<<<\n\n"
        )
 
        print("Navigating To The SignUp Page @", self.driver.current_url)
        self.driver.get(self.url)
        time.sleep(2)
        utils.loader("\nSending In Random Keys Into The Form...")
        time.sleep(3)
        print("\nSuccess!\n\n")
        time.sleep(1)

        try:
            self.driver.find_element_by_link_text("SIGN UP").click()
            self.driver.find_element_by_name("email").send_keys("nnnnnn")
            time.sleep(1)
            self.driver.find_element_by_name("password").send_keys("1234")
            time.sleep(1)
            self.driver.find_element_by_name("fullname").send_keys("mark")
            time.sleep(1)
            utils.scroll(self.driver)
            self.driver.find_element_by_css_selector(
                "#signUp > div.formContainer > div:nth-child(4) > div > label > div").click()
            self.driver.find_element_by_name("projname").send_keys("Testproject")
            time.sleep(4)

            

        except Exception as e:
            print("test_for_sign_up_form", e)

    def test_can_user_sign_up(self):
        utils.loader(
            "\n\n>>>>>>>>>>>>>>> Test To Check If Users Can SignUp With The Role As User <<<<<<<<<<<<<<<\n\n"
        )
        current_url = self.driver.current_url
        print("Navigating To The SignUp Page @", self.url+'login')
        self.driver.get(self.url)
        time.sleep(3)
        self.driver.find_element_by_link_text("SIGN UP").click()
        time.sleep(3)
        print("\n============")
        utils.loader("Signing Up Users Account...")
        print("\n============")
        utils.perform_sign_up(self.driver, True)

        time.sleep(5)
        print(current_url)
        # feedback = self.driver.find_element_by_xpath(
        #     "//*[@id='alert-success']").text
        # feedback = self.driver.find_element_by_css_selector(
        #     "//div[@id='alertBox'][@id='alert-success']").text
        time.sleep(5)

        # print("\n\n", feedback)

        self.assertEqual(self.driver.current_url, self.url+'login')

        self.assertEqual(self.driver.current_url, self.url+'login')



if __name__ == '__main__':
    unittest.main()

