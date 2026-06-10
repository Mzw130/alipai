import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import { useAiTool } from '../../hooks/useAiTool';

export default function SuperRealisticScreen() {
  const n = useNavigation();
  const { selectedImage, isProcessing, result, error, pickImage, takePhoto, generate, clear } = useAiTool('super_realistic');

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}><TouchableOpacity onPress={()=>n.goBack()}><Ionicons name="chevron-back" size={24} color={Colors.text} /></TouchableOpacity><View style={s.headerCenter}><Text style={s.headerTitle}>超级写实</Text><Text style={s.headerSub}>Super Realistic</Text></View><View style={{width:24}} /></View>
      <ScrollView contentContainerStyle={s.content}>
        {!selectedImage ? <TouchableOpacity style={s.imageArea} onPress={pickImage}><Ionicons name="camera" size={40} color={Colors.primary} /><Text style={s.uploadText}>选择图片</Text><Text style={s.uploadSub}>从相册选取或拍照</Text></TouchableOpacity>
        : <View style={s.pv}><Image source={{uri:selectedImage}} style={s.pvImg} /><View style={s.pvBtns}><TouchableOpacity style={s.ab} onPress={pickImage}><Ionicons name="swap-horizontal" size={16} color={Colors.text} /><Text style={s.at}>换图</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={takePhoto}><Ionicons name="camera" size={16} color={Colors.text} /><Text style={s.at}>拍照</Text></TouchableOpacity><TouchableOpacity style={s.ab} onPress={clear}><Ionicons name="trash" size={16} color={Colors.error} /><Text style={[s.at,{color:Colors.error}]}>移除</Text></TouchableOpacity></View></View>}
        {result?.status==='completed'&&result.result_url&&<View style={s.rc}><Text style={s.rt}>✨ 处理完成</Text><Image source={{uri:result.result_url}} style={s.ri} /><Text style={s.rm}>耗时:{result.processing_time_ms}ms|积分:{result.credits_used}</Text></View>}
        {error&&<View style={s.er}><Ionicons name="alert-circle" size={18} color={Colors.error} /><Text style={s.et}>{error}</Text></View>}
        {!result&&<View style={s.dc}><Text style={s.dt}>让任何图片更真实，将图片转为写实风格</Text></View>}
        <TouchableOpacity style={[s.gb,(!selectedImage||isProcessing)&&s.gbd]} onPress={()=>generate()} disabled={!selectedImage||isProcessing}><Ionicons name="color-wand" size={20} color={Colors.text} /><Text style={s.gt}>{isProcessing?'处理中...':'生成'}</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.bg},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:Spacing.xl,paddingVertical:Spacing.md},headerCenter:{alignItems:'center'},headerTitle:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.text},headerSub:{fontSize:FontSize.xs,color:Colors.textMuted},
  content:{padding:Spacing.xl,paddingBottom:100},imageArea:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing['2xl'],alignItems:'center',gap:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderStyle:'dashed',marginBottom:Spacing.xl},uploadText:{fontSize:FontSize.md,color:Colors.primary,fontWeight:FontWeight.medium},uploadSub:{fontSize:FontSize.sm,color:Colors.textMuted},
  pv:{marginBottom:Spacing.xl},pvImg:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.lg,backgroundColor:Colors.card},pvBtns:{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.sm},ab:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.card,paddingHorizontal:Spacing.md,paddingVertical:Spacing.sm,borderRadius:BorderRadius.md},at:{fontSize:FontSize.xs,color:Colors.text},
  rc:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing.lg,marginBottom:Spacing.xl,borderWidth:1,borderColor:Colors.success+'40'},rt:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.success,marginBottom:Spacing.md},ri:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.md,backgroundColor:Colors.cardLight},rm:{fontSize:FontSize.xs,color:Colors.textMuted,marginTop:Spacing.sm,textAlign:'center'},
  er:{backgroundColor:Colors.error+'15',borderRadius:BorderRadius.md,padding:Spacing.md,flexDirection:'row',alignItems:'center',gap:Spacing.sm,marginBottom:Spacing.xl},et:{fontSize:FontSize.sm,color:Colors.error,flex:1},
  dc:{backgroundColor:Colors.card,borderRadius:BorderRadius.md,padding:Spacing.lg,marginBottom:Spacing['2xl'],borderWidth:1,borderColor:Colors.border},dt:{fontSize:FontSize.base,color:Colors.textSecondary,textAlign:'center',lineHeight:22},
  gb:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:Spacing.sm,backgroundColor:Colors.primary,borderRadius:BorderRadius.xl,paddingVertical:Spacing.base,...Shadow.button},gbd:{opacity:0.5},gt:{fontSize:FontSize.lg,fontWeight:FontWeight.semibold,color:Colors.text},
});
