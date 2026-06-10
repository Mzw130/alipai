import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import { useAiTool } from '../../hooks/useAiTool';

const styles_list = [
  { key: 'lean', label: '精瘦型', desc: '低体脂、线条分明', icon: 'trending-down', color: '#4ADE80' },
  { key: 'athletic', label: '运动型', desc: '匀称紧致肌肉线条', icon: 'fitness', color: '#60A5FA' },
  { key: 'bodybuilder', label: '健美型', desc: '饱满立体肌肉轮廓', icon: 'barbell', color: '#F59E0B' },
  { key: 'massive', label: '巨肌型', desc: '极致夸张肌肉体态', icon: 'flash', color: '#EF4444' },
];

export default function MuscleEnhanceScreen() {
  const n = useNavigation();
  const { selectedImage, isProcessing, resultUrl, error, pickImage, takePhoto, generate, clear } = useAiTool('muscle_enhance');
  const [selectedStyle, setSelectedStyle] = useState<string|null>(null);
  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><TouchableOpacity onPress={()=>n.goBack()}><Ionicons name="chevron-back" size={24} color={Colors.text} /></TouchableOpacity><View style={s.hc}><Text style={s.ht}>肌肉增强</Text><Text style={s.hs}>Muscle Enhancement</Text></View><View style={{width:24}} /></View>
      <ScrollView contentContainerStyle={s.ct}>
        {!selectedImage ? <TouchableOpacity style={s.ia} onPress={pickImage}><Ionicons name="camera" size={40} color={Colors.primary} /><Text style={s.ut}>选择图片</Text><Text style={s.us}>从相册选取或拍照</Text></TouchableOpacity>
        : <View style={s.pv}><Image source={{uri:selectedImage}} style={s.pi} /><View style={s.pb}><TouchableOpacity style={s.ab} onPress={pickImage}><Ionicons name="swap-horizontal" size={16} color={Colors.text} /><Text style={s.at}>换图</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={takePhoto}><Ionicons name="camera" size={16} color={Colors.text} /><Text style={s.at}>拍照</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={clear}><Ionicons name="trash" size={16} color={Colors.error} /><Text style={[s.at,{color:Colors.error}]}>移除</Text></TouchableOpacity></View></View>}
        {resultUrl && <View style={s.rc}><Text style={s.rt}>处理完成</Text><Image source={{uri:resultUrl}} style={s.ri} /></View>}
        {error && <View style={s.er}><Ionicons name="alert-circle" size={18} color={Colors.error} /><Text style={s.et}>{error}</Text></View>}
        <Text style={s.st}>肌肉风格</Text>
        {styles_list.map((item)=>(<TouchableOpacity key={item.key} style={[s.si,selectedStyle===item.key&&{borderColor:item.color,backgroundColor:item.color+'15'}]} onPress={()=>setSelectedStyle(item.key)}><View style={[s.sic,{backgroundColor:item.color+'25'}]}><Ionicons name={item.icon as any} size={28} color={item.color} /></View><Text style={[s.sl,selectedStyle===item.key&&{color:item.color}]}>{item.label}</Text><Text style={s.sd}>{item.desc}</Text>{selectedStyle===item.key&&<View style={[s.bad,{backgroundColor:item.color}]}><Ionicons name="checkmark" size={12} color={Colors.text} /></View>}</TouchableOpacity>))}
        <TouchableOpacity style={[s.gb,(!selectedImage||isProcessing||!selectedStyle)&&s.gbd]} onPress={()=>generate({style:selectedStyle})} disabled={!selectedImage||isProcessing||!selectedStyle}><Ionicons name="color-wand" size={20} color={Colors.text} /><Text style={s.gt}>{isProcessing?'处理中...':'生成'}</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg},h:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:Spacing.xl,paddingVertical:Spacing.md},hc:{alignItems:'center'},ht:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.text},hs:{fontSize:FontSize.xs,color:Colors.textMuted},
  ct:{padding:Spacing.xl,paddingBottom:100},ia:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing['2xl'],alignItems:'center',gap:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderStyle:'dashed',marginBottom:Spacing.xl},ut:{fontSize:FontSize.md,color:Colors.primary,fontWeight:FontWeight.medium},us:{fontSize:FontSize.sm,color:Colors.textMuted},
  pv:{marginBottom:Spacing.xl},pi:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.lg,backgroundColor:Colors.card},pb:{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.sm},ab:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.card,paddingHorizontal:Spacing.md,paddingVertical:Spacing.sm,borderRadius:BorderRadius.md},at:{fontSize:FontSize.xs,color:Colors.text},
  rc:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing.lg,marginBottom:Spacing.xl,borderWidth:1,borderColor:Colors.success+'40'},rt:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.success,marginBottom:Spacing.md},ri:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.md,backgroundColor:Colors.cardLight},
  er:{backgroundColor:Colors.error+'15',borderRadius:BorderRadius.md,padding:Spacing.md,flexDirection:'row',alignItems:'center',gap:Spacing.sm,marginBottom:Spacing.xl},et:{fontSize:FontSize.sm,color:Colors.error,flex:1},
  st:{fontSize:FontSize.md,fontWeight:FontWeight.semibold,color:Colors.text,marginBottom:Spacing.md},
  si:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing.lg,flexDirection:'row',alignItems:'center',gap:Spacing.md,borderWidth:1,borderColor:Colors.border,marginBottom:Spacing.md},sic:{width:52,height:52,borderRadius:BorderRadius.md,justifyContent:'center',alignItems:'center'},sl:{fontSize:FontSize.md,fontWeight:FontWeight.semibold,color:Colors.text,flex:1},sd:{fontSize:FontSize.xs,color:Colors.textMuted,position:'absolute',left:84,bottom:Spacing.lg},bad:{width:22,height:22,borderRadius:11,justifyContent:'center',alignItems:'center'},
  gb:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:Spacing.sm,backgroundColor:Colors.primary,borderRadius:BorderRadius.xl,paddingVertical:Spacing.base,...Shadow.button},gbd:{opacity:0.5},gt:{fontSize:FontSize.lg,fontWeight:FontWeight.semibold,color:Colors.text},
});
