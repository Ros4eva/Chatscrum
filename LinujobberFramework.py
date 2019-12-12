import os
import unittest

# The Individual Scripts

import HTMLTestRunner
from utils import get_mail_client, get_parser
from authentication import Authentication

direct = os.getcwd()


class MyTestSuite(unittest.TestCase):
    def test_allTest(self):
        linux_Test = unittest.TestSuite()
        linux_Test.addTests([
           unittest.defaultTestLoader.loadTestsFromTestCase(Authentication)
        ])
        with open(direct + "/TestResult-Int.html", "w") as outfield:
            runner1 = HTMLTestRunner.HTMLTestRunner(
                stream=outfield,
                title="LinuxJobber Test Report",
                description="New Automated Test for the Main FUnctions of the Linuxjobber Site"
            )
            runner1.run(linux_Test)
        # todo Add a mail notification when the script runs finish
        mailer = get_mail_client()
        parser = get_parser()
        site = parser.get('site_to_test', 'url')
        recipient_list = parser.get('mail', 'recipients')
        from utils import send_email_ses
        send_email_ses('Int', recipient_list)


if __name__ == '__main__':
    unittest.main()
