import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, List, IconButton } from 'react-native-paper';
import { styles } from './styles';

interface ListManagerProps {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
  placeholder?: string;
  icon?: string;
}

const ListManager: React.FC<ListManagerProps> = ({
  title,
  items,
  onAddItem,
  onRemoveItem,
  placeholder = 'Agregar nuevo item',
  icon = 'plus',
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          label={title}
          value={newItem}
          onChangeText={setNewItem}
          style={[styles.input, styles.flex1]}
          placeholder={placeholder}
        />
        <IconButton
          icon={icon}
          size={24}
          onPress={handleAdd}
          disabled={!newItem.trim()}
        />
      </View>

      {items.map((item, index) => (
        <List.Item
          key={index}
          title={item}
          style={styles.listItem}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => onRemoveItem(index)}
            />
          )}
        />
      ))}
    </View>
  );
};

export default ListManager;
