from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, 
    AbstractBaseUser,
)


class UserAccountManager(BaseUserManager):
    def create_user(self, username, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        email=self.normalize_email(email)
        email.lower()

        user = self.model(
            email=username,
            **kwargs,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password=None, **kwargs):
        user = self.create_user(
            username=username,
            password=password,
            **kwargs
        )

        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class UserAccount(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    username = models.TextField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin