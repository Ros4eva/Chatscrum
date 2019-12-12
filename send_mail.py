


import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Wrong fornat")
        print("Usage: sendmail.py int|stage")
        sys.exit(1)
    else:
        environment = sys.argv[1]
        from utils import send_email_ses, get_parser
        parser = get_parser()
        recipient_list = parser.get('mail', 'recipients')
        from utils import send_email_ses
        send_email_ses(
            environment,recipient_list
        )