import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import { useAiTool } from '../../hooks/useAiTool';

const ratios = [
  { key: 'head_body', label: '头身比', desc: '优化头部与身体比例', icon: 'body' },
  { key: 'waist_hip', label: '腰臀比', desc: '调整腰臀曲线比例', icon: 'resize' },
  { key: 'leg_body', label: '腿身比', desc: '拉长腿部视觉比例', icon: 'walk' },
  { key: 'shoulder', label: '肩宽比', desc: '优化肩部宽度比例', icon: 'shirt' },
];

export default function ProportionScreen() {
  const n = useNavigation();
  const { selectedImage, isProcessing, resultUrl, error, taskError, pickImage, takePhoto, generate, clear } = useAiTool('proportion');
  const [selectedRatio, setSelectedRatio] = useState<string|null>(null);
  return (
    <SafeAreaView style={s.c}>
      <View style={s.h}><TouchableOpacity onPress={()=>n.goBack()}><Ionicons name="chevron-back" size={24} color={Colors.text} /></TouchableOpacity><View style={s.hc}><Text style={s.ht}>比例调整</Text><Text style={s.hs}>Proportion Adjustment</Text></View><View style={{width:24}} /></View>
      <ScrollView contentContainerStyle={s.ct}>
        {!selectedImage ? <TouchableOpacity style={s.ia} onPress={pickImage}><Ionicons name="camera" size={40} color={Colors.primary} /><Text style={s.ut}>选择图片</Text><Text style={s.us}>从相册选取或拍照</Text></TouchableOpacity>
        : <View style={s.pv}><Image source={{uri:selectedImage}} style={s.pi} /><View style={s.pb}><TouchableOpacity style={s.ab} onPress={pickImage}><Ionicons name="swap-horizontal" size={16} color={Colors.text} /><Text style={s.at}>换图</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={takePhoto}><Ionicons name="camera" size={16} color={Colors.text} /><Text style={s.at}>拍照</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={clear}><Ionicons name="trash" size={16} color={Colors.error} /><Text style={[s.at,{color:Colors.error}]}>移除</Text></TouchableOpacity></View></View>}
        {resultUrl && <View style={s.rc}><Text style={s.rt}>处理完成</Text><Image source={{uri:resultUrl}} style={s.ri} /></View>}
        {error && <View style={s.er}><Ionicons name="alert-circle" size={18} color={Colors.error} /><Text style={s.et}>{error}</Text></View>}
        <Text style={s.st}>比例调节项</Text>
        {ratios.map((item)=>(<TouchableOpacity key={item.key} style={[s.ri2,selectedRatio===item.key&&{borderColor:Colors.primary,backgroundColor:'#1A1530'}]} onPress={()=>setSelectedRatio(item.key)}><View style={[s.ric,selectedRatio===item.key&&{backgroundColor:Colors.primary}]}><Ionicons name={item.icon as any} size={28} color={selectedRatio===item.key?Colors.text:Colors.primary} /></View><View style={{flex:1}}><Text style={[s.rl,selectedRatio===item.key&&{color:Colors.primary}]}>{item.label}</Text><Text style={s.rd}>{item.desc}</Text></View>{selectedRatio===item.key&&<Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}</TouchableOpacity>))}
        <TouchableOpacity style={[s.gb,(!selectedImage||isProcessing||!selectedRatio)&&s.gbd]} onPress={()=>generate({ratio_type:selectedRatio})} disabled={!selectedImage||isProcessing||!selectedRatio}><Ionicons name="color-wand" size={20} color={Colors.text} /><Text style={s.gt}>{isProcessing?'处理中...':'生成'}</Text></TouchableOpacity>
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
  ri2:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing.lg,flexDirection:'row',alignItems:'center',gap:Spacing.md,borderWidth:1,borderColor:Colors.border,marginBottom:Spacing.md},ric:{width:52,height:52,borderRadius:26,backgroundColor:Colors.bg,justifyContent:'center',alignItems:'center',marginRight:Spacing.md},rl:{fontSize:FontSize.md,fontWeight:FontWeight.semibold,color:Colors.text,marginBottom:2},rd:{fontSize:FontSize.xs,color:Colors.textMuted},
  gb:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:Spacing.sm,backgroundColor:Colors.primary,borderRadius:BorderRadius.xl,paddingVertical:Spacing.base,...Shadow.button},gbd:{opacity:0.5},gt:{fontSize:FontSize.lg,fontWeight:FontWeight.semibold,color:Colors.text},
});
