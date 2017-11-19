#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":

    os.environ['ORACLE_HOME']='/u01/app/oracle/product/11.2.0/xe/'
    os.environ['LD_LIBRARY_PATH']='/usr/lib/oracle/11.2/client64/lib/'
    os.environ['LD_RUN_PATH']='/usr/lib/oracle/11.2/client64/lib/'

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smok.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    execute_from_command_line(sys.argv)
