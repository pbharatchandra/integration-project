from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Product
from .serializers import ProductSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import ProductPagination
from .permissions import IsSellerOrReadOnly as IsSeller


# Create your views here.
class ProductListView(ListCreateAPIView):
    queryset         = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter,filters.OrderingFilter]
    search_fields   = ['title', 'brand']
    ordering_fields = ['price', 'rating']
    filterset_fields = ['category', 'brand','is_prime']  # ← new!
    pagination_class = ProductPagination

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)



class ProductDetailView(RetrieveUpdateDestroyAPIView):
    queryset         = Product.objects.all()
    serializer_class = ProductSerializer

    permission_classes = [IsSeller]   # ← the lock
