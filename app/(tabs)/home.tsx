import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Button,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { db } from "@/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore methods
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([] as any);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([] as any);
  const [cart, setCart] = useState([]);
  const [filterType, setFilterType] = useState(""); // For filtering by type

  // Fetch products from Firestore on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.log("Error fetching products: ", error);
    }
    setLoading(false);
  };

  // Filter products by type
  const filterByType = (type: string) => {
    if (type === "") {
      setFilteredProducts(products); // Show all if no filter is selected
    } else {
      const filtered = products.filter((product: any) => product.type === type);
      setFilteredProducts(filtered);
    }
  };

  // Search functionality
  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = products.filter((product: any) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Add product to cart
  const addToCart = (product: any) => {
    // setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  // Render product item
  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  // Show loading spinner while fetching products
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doggy Food Store</Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.cartIcon}
        >
          <Ionicons name="cart-outline" size={28} color="black" />
          <Text style={styles.cartCount}>{cart.length}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => filterByType("")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => filterByType("Dry Food")}
        >
          <Text style={styles.filterText}>Dry Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => filterByType("Grain-Free")}
        >
          <Text style={styles.filterText}>Grain-Free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => fetchProducts()}
        >
          <Text style={styles.filterText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cartIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartCount: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25, // Make the search field rounded
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    width: "90%", // Adjust width as needed
    alignSelf: "center", // Center the search field
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  filterButton: {
    backgroundColor: "#007bff", // Blue background, change to any color you like
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Rounded edges for badge-like look
    marginHorizontal: 5, // Space between badges
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterText: {
    color: "#fff", // White text color
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  productList: {
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
