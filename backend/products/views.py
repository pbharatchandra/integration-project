from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Product
from .serializers import ProductSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import ProductPagination
from .permissions import IsSellerOrReadOnly as IsSeller
from rest_framework.permissions import IsAuthenticated

def visible_products(user):
    if user.is_authenticated:
        return Product.objects.all()
    return Product.objects.exclude(is_prime= True)

PRIME_VALUES = {'true', '1'}

# Create your views here.
class ProductListView(ListCreateAPIView):
    # queryset = Product.objects.all()
    def get_queryset(self):
        return visible_products(self.request.user)
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        asked_for_prime = self.request.query_params.get('is_prime', '')
        if asked_for_prime.lower() in PRIME_VALUES:
            return [IsAuthenticated()]
        return super().get_permissions()
        
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,filters.OrderingFilter]
    search_fields = ['title', 'brand']
    ordering_fields = ['price', 'rating']
    filterset_fields = ['category', 'brand','is_prime'] # ← new!
    pagination_class = ProductPagination
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class ProductDetailView(RetrieveUpdateDestroyAPIView):
    # queryset = Product.objects.all()
    def get_queryset(self):
        return visible_products(self.request.user)
    serializer_class = ProductSerializer
    permission_classes = [IsSeller] # ← the lock
