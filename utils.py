import os
import time
from configparser import ConfigParser

import yagmail as yagmail
from selenium.webdriver import Chrome, ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from selenium.webdriver.support.wait import WebDriverWait

parser = ConfigParser()
parser.read('./settings.ini')
username = parser.get('authentication', 'username')
password = parser.get('authentication', 'password')

url = parser.get('chatscrum_site_to_test', 'url')


def loader(message):
    import sys
    import time
    loading = True
    loading_speed = 10
    loading_string = message
    while loading:
        for index, char in enumerate(loading_string):
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(1.0 / loading_speed)
        index += 1
        loading = False


def scroll(driver):
    driver.execute_script("window.scrollTo(0,400)")
    time.sleep(1)

def generate_details():
    import random
    data = {}
    names = ['Ismail', 'Korede', 'Sharon', 'Temidire', 'Kanyinsola', 'Nike', 'Dotun', 'Kikelomo', 'Tomisin',
             'Abosede', 'Blessing',
             'Ibrahim', 'Funsho']
    data['firstname'] = random.sample(names, 1)[0]
    data['lastname'] = random.sample(names, 1)[0]
    data['username'] = "test_" + "".join(
        [data['firstname'], "".join(random.sample("1234567890_qwertyuiopasdfghjklzxcvbnm", 3))])
    data['email'] = data['username'] + "@mailnesia.com"
    data['fullname'] = data['firstname'] + " " + data['lastname']
    data['project'] = data['username'] + str(random.randint(0, 20))
    data['password'] = "testing123$$"
    return data


def get_parser(*val):
    if val:
        for i in val:
            parser.read(i)
    return parser


# def get_driver(utils=False):
#     if not utils:
#         try:
#             close_firefox()
#         except:
#             pass
#     DEBUG = False
#     BROWSER = "chrome"
#     try:
#         parser = get_parser()
#         DEBUG = parser.getboolean("config", 'debug')
#         BROWSER = parser.get("config", 'browser')
#     except:
#         print("Could not read config")
#         pass
#     finally:
#         if BROWSER == "chrome":
#             if not DEBUG:
#                 options = Options()
#                 options.add_argument('no-sandbox')
#                 options.add_argument('disable-dev-shm-usage')
#                 options.add_argument('disable-gpu')
#                 from selenium.webdriver import \
#                     Remote  # options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
#                 driver = Remote(command_executor='http://50.112.205.140:4444/wd/hub',
#                                 desired_capabilities=options.to_capabilities())
#                 return driver
#             return Chrome('./chromedriver.exe')
#         else:
#             from selenium import webdriver
#             if not DEBUG:
#                 opt = webdriver.FirefoxOptions()
#                 opt.add_argument('-headless')
#                 opt.add_argument('--disable-dev-shm-usage')
#                 return webdriver.Remote(desired_capabilities=opt.to_capabilities())
#                 return webdriver.Firefox(options=opt)
#             return webdriver.Firefox('./geckodriver.exe')

def get_driver(utils=False):
    if not utils:
        try:
            close_firefox()
        except:
            pass
    DEBUG = False
    BROWSER = "chrome"
    try:
        parser = get_parser()
        DEBUG = parser.getboolean("config", 'debug')
        BROWSER = parser.get("config", 'browser')
    except:
        print("Could not read config")
        pass
    finally:
        if BROWSER == "chrome":
            if not DEBUG:
                # options = Options()
                # options.add_argument('no-sandbox')
                # options.add_argument('disable-dev-shm-usage')
                # # options.add_argument('headless')
                # options.add_argument('disable-gpu')
                # options.set_capability('unhandledPromptBehavior', 'accept')
                chrome_options = Options()
                chrome_options.add_argument("--headless")
                chrome_options.add_argument("--disable-dev-shm-usage")
                chrome_options.add_argument("--no-sandbox")
                chrome_options.add_argument("--window-size=1920x1080")
                chrome_options.set_capability('unhandledPromptBehavior', 'accept')
                driver = Chrome(options=chrome_options)

                # from selenium.webdriver import \
                #     Remote  # options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
                # driver = Remote(command_executor='http://50.112.205.140:4444/wd/hub',
                #                 desired_capabilities=options.to_capabilities())

                return driver
            return Chrome()
        else:
            from selenium import webdriver
            if not DEBUG:
                opt = webdriver.FirefoxOptions()
                opt.add_argument('-headless')
                opt.add_argument('--disable-dev-shm-usage')
                opt.set_capability('unhandledPromptBehavior', 'accept')
                return webdriver.Remote(desired_capabilities=opt.to_capabilities())
                return webdriver.Firefox(options=opt)
            return webdriver.Firefox()



def close_firefox():
    DEBUG = False
    try:
        DEBUG = parser.get('config', 'debug')
    except:
        print("can't find config")
    finally:
        if DEBUG:
            pass
        else:
            import psutil
            try:

                PROCNAME = "geckodriver" if parser.get('config',
                                                    'browser') == "firefox" else "chrome"  # or chromedriver or IEDriverServer
                PROCNAME2 = "firefox" if parser.get('config',
                                                    'browser') == "firefox" else "chrome"  # or chromedriver or IEDriverServer # or chromedriver or IEDriverServer
                x = [proc.kill() for proc in psutil.process_iter(attrs=['pid', 'name'])
                    if PROCNAME in proc.name() or PROCNAME2 in proc.name()]
            except psutil.NoSuchProcess:
                pass


def perform_registration(driver, on_reg_page=False, user=True):
    driver.maximize_window()
    data = generate_details()
    if not on_reg_page:
        driver.find_element_by_link_text("Sign Up").click()
    else:
        driver.find_element_by_link_text("Create new account").click()
    fullname = data.get('fullname')
    email = data.get('email')
    password = parser.get('authentication', 'password')
    wait = WebDriverWait(driver, 10)
    driver.find_element_by_name('fullname').send_keys(fullname)
    driver.find_element_by_name('email').send_keys(email)
    driver.find_element_by_name('password').send_keys(password)
    driver.find_element_by_id('btn-one').click()
    import time
    time.sleep(20)
    if "Success" in driver.title:
        driver.get(url)
        # logger.info(data)
        return data
    elif "Error" in driver.title:
        driver.get(url)
        return data
    else:
        print(driver.title)
        raise AssertionError("Error in sign up")


def perform_sign_up(driver, user=False):
    driver.maximize_window()
    data = generate_details()
    print("\n\nGenerated Data For Users SignUp And Login: ", data)
    try:
        driver.find_element_by_name("email").click()
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys(data['email'])
        time.sleep(1)

        driver.find_element_by_name("password").click()
        driver.find_element_by_name("password").clear()
        driver.find_element_by_name("password").send_keys(data['password'])
        time.sleep(1)

        driver.find_element_by_name("fullname").click()
        driver.find_element_by_name("fullname").clear()
        driver.find_element_by_name("fullname").send_keys(data['fullname'])
        time.sleep(1)

        if user:
            data['role'] = "Developer"
            time.sleep(1)

        else:
            data['role'] = "Owner"
            driver.find_element_by_css_selector(
                "#signUp > div.formContainer > div:nth-child(4) > div > label > div").click()
            driver.find_element_by_name("projname").send_keys(data['project'])

        time.sleep(4)
        
        driver.find_element_by_xpath("//*[@id='btn-one']").click()
        
        time.sleep(5)

    except Exception as e:
        print("perform_sign_up: ", e)

    return data



def handle_alert(driver, text, cancel=False):
    prompt_alert = driver.switch_to.alert
    prompt_alert.send_keys(text)
    # time.sleep(5)
    if cancel:
        prompt_alert.dismiss()
    else:
        prompt_alert.accept()


def get_logger(log_name):
    import logging
    logger = logging.getLogger(log_name)
    # Create handlers
    # c_handler = logging.StreamHandler()
    f_handler = logging.FileHandler('file.log')
    f_handler.setLevel(logging.INFO)
    # Create formatters and add it to handlers
    f_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    f_handler.setFormatter(f_format)
    # c_handler.setFormatter(f_format)

    # Add handlers to the logger
    logger.addHandler(f_handler)
    logger.setLevel(logging.INFO)
    # logger.addHandler(c_handler)
    return logger


def get_mail_client():
    parser = get_parser()
    username = parser.get('mail', 'username')
    password = parser.get('mail', 'password')
    # yag = yagmail.SMTP(username,password)
    return yagmail.SMTP(user=username, password=password, host="email-smtp.us-west-2.amazonaws.com", port=587,
                        starttls=True)


def send_email_ses(environment, recipients,
                   username=parser.get('mail', 'username'),
                   password=parser.get('mail', 'password'),
                   from_address=parser.get('mail', 'sender')):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    msg = MIMEMultipart()
    msg['From'] = from_address
    msg['To'] = recipients
    msg['Subject'] = "Test Notification: {}".format(environment.upper())

    from bs4 import BeautifulSoup
    try:

        with open('TestResult-{}.html'.format(environment), 'r') as stream:
            data = "{}".format(BeautifulSoup(stream.read()))
            data = data.replace('\n', '').replace('\r', '')
            html = data
            body = 'Test results for {}'.format(environment)

            from email.mime.text import MIMEText
            msg.attach(MIMEText(body, 'plain'))
            msg.attach(MIMEText(html, 'html'))

            server = smtplib.SMTP('email-smtp.us-west-2.amazonaws.com', 587)
            server.starttls()
            server.login(username, password)
            text = msg.as_string()
            server.sendmail(from_address, recipients.split(','), text)
            server.quit()
            logger = get_logger('Mailing')
            logger.info('Mail Sent')
    except Exception as e:
        logger = get_logger('Mailing')
        logger.info('Mail Not Sent: \n {}'.format(e))
