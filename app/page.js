"use client";

import * as React from 'react';
import { Box, Typography, Button, Modal, TextField, Stack, AppBar, Toolbar, IconButton, Fab } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const inventoryCollectionRef = collection(firestore, 'inventory');
    const snapshot = await getDocs(inventoryCollectionRef);
    const inventoryList = snapshot.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = (query) => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack>
      <AppBar position="fixed">
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Grocery Tracker
        </Typography>
      </AppBar>
      <Toolbar />
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        paddingTop={8}
        bgcolor={"#DFD3C3"}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Stack width="50%" direction={'row'} spacing={2} justifyContent="center" alignItems="center">

          <SearchIcon fontSize="large" color="primary"/>
          <TextField
            id="search-bar"
            onChange={(e) => handleSearch(e.target.value)}
            label="Search List"
            variant="outlined"
            placeholder="Search..."
            size="large"
            fullWidth
          />
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
              <AddIcon />
            </Fab>
          </Box>
        </Stack>
        <Box border={'1px solid #333'}>
          <Box
            width="800px"
            height="100px"
            bgcolor={'#D0B8A8'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Shopping List
            </Typography>
          </Box>
          <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#F8EDE3'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}