from django.db import models

# Create your models here.
class URLAssociations(models.Model):
	url = models.CharField(max_length=420, primary_key=True)
	rating = models.PositiveSmallIntegerField(default=0)

	def __str__(self):
		return '%s %s' % (self.url, self.rating)
