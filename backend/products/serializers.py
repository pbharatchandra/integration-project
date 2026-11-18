from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Product
        fields = ['id', 'title', 'brand', 'price', 'category', 'imageUrl', 'rating', 'is_prime']
        read_only_fields = ['seller']   # ← clients can’t send this


