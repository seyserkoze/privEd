from django.db import models



class Tracker(models.Model):
	url = models.CharField(max_length=100)
	kind = models.CharField(max_length=20)

	def __str__(self):
		return '%s %s' % (self.url, self.kind)


# Create your models here.
class Website(models.Model):
	url = models.CharField(max_length=420, primary_key=True)
	rating = models.PositiveSmallIntegerField(default=0)
	trackers = models.ManyToManyField(Tracker, blank=True)

	def __str__(self):
		return '%s %s' % (self.url, self.rating)

class User(models.Model):
	email = models.EmailField(null=False, blank=False)
	identity = models.CharField(null=False, blank=False, max_length=20, primary_key=True)
	history = models.ManyToManyField(Website, blank=True)
