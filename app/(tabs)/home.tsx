import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { db } from "@/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([] as any);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([] as any);
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null as any);
  const [currentFilter, setCurrentFilter] = useState("" as any);

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
    setCurrentFilter(type);
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

  // Open Modal to show product details
  const showProductDetails = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
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
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => showProductDetails(item)}
      >
        <Text style={styles.infoButtonText}>More info</Text>
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
          style={[
            styles.filterButton,
            currentFilter === "" && styles.activeFilterButton, // Highlight if "All" is selected
          ]}
          onPress={() => filterByType("")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            currentFilter === "Dry Food" && styles.activeFilterButton, // Highlight if "Dry Food" is selected
          ]}
          onPress={() => filterByType("Dry Food")}
        >
          <Text style={styles.filterText}>Dry Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            currentFilter === "Grain-Free" && styles.activeFilterButton, // Highlight if "Grain-Free" is selected
          ]}
          onPress={() => filterByType("Grain-Free")}
        >
          <Text style={styles.filterText}>Grain-Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton} // No need to check filter for "Refresh"
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

      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>
                  ${selectedProduct.price.toFixed(2)}
                </Text>
                <Text style={styles.modalText}>
                  Type: {selectedProduct.type}
                </Text>
                <Text style={styles.modalText}>
                  Brand: {selectedProduct.brand}
                </Text>
                <Text style={styles.modalText}>
                  Description: {selectedProduct.description}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      )}
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
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
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
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  activeFilterButton: {
    backgroundColor: "#088F8F",
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
  infoButton: {
    backgroundColor: "#088F8F",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContainer: {
    alignItems: "center",
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: "green",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
