import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../theme';
import { useAiTool } from '../../hooks/useAiTool';

export default function BackgroundRemovalScreen() {
  const nav = useNavigation();
  const { selectedImage, isProcessing, result, error, pickImage, takePhoto, generate, clear } = useAiTool('bg_remove');

  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => nav.goBack()}><Ionicons name="chevron-back" size={24} color={Colors.text} /></TouchableOpacity>
        <View style={st.headerCenter}><Text style={st.headerTitle}>去背景</Text><Text style={st.headerSub}>Background Removal</Text></View>
        <View style={{width:24}} />
      </View>
      <ScrollView contentContainerStyle={st.content}>
        {!selectedImage ? (
          <TouchableOpacity style={st.imageArea} onPress={pickImage}><Ionicons name="camera" size={40} color={Colors.primary} /><Text style={st.uploadText}>选择图片</Text><Text style={st.uploadSub}>从相册选取或拍照</Text></TouchableOpacity>
        ) : (
          <View style={st.previewWrap}><Image source={{uri:selectedImage}} style={st.preview} /><View style={st.previewActions}><TouchableOpacity style={st.actionBtn} onPress={pickImage}><Ionicons name="swap-horizontal" size={16} color={Colors.text} /><Text style={st.actionText}>换图</Text></TouchableOpacity><TouchableOpacity style={st.actionBtn} onPress={takePhoto}><Ionicons name="camera" size={16} color={Colors.text} /><Text style={st.actionText}>拍照</Text></TouchableOpacity><TouchableOpacity style={st.actionBtn} onPress={clear}><Ionicons name="trash" size={16} color={Colors.error} /><Text style={[st.actionText,{color:Colors.error}]}>移除</Text></TouchableOpacity></View></View>
        )}
        {result?.status==='completed' && result.result_url && <View style={st.resultCard}><Text style={st.resultTitle}>✨ 处理完成</Text><Image source={{uri:result.result_url}} style={st.resultImage} /><Text style={st.resultMeta}>耗时: {result.processing_time_ms}ms</Text></View>}
        {error && <View style={st.errorCard}><Ionicons name="alert-circle" size={18} color={Colors.error} /><Text style={st.errorText}>{error}</Text></View>}
        {!result && <View style={st.descCard}><Ionicons name="cut" size={24} color={Colors.primary} /><Text style={st.descText}>一键去除图片背景，AI 智能识别主体</Text></View>}
        <TouchableOpacity style={[st.generateBtn, (!selectedImage||isProcessing)&&st.generateBtnDisabled]} onPress={()=>generate()} disabled={!selectedImage||isProcessing}><Ionicons name="color-wand" size={20} color={Colors.text} /><Text style={st.generateText}>{isProcessing?'处理中...':'去背景'}</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.bg},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:Spacing.xl,paddingVertical:Spacing.md},headerCenter:{alignItems:'center'},headerTitle:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.text},headerSub:{fontSize:FontSize.xs,color:Colors.textMuted},
  content:{padding:Spacing.xl,paddingBottom:100},imageArea:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing['2xl'],alignItems:'center',gap:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderStyle:'dashed',marginBottom:Spacing.xl},uploadText:{fontSize:FontSize.md,color:Colors.primary,fontWeight:FontWeight.medium},uploadSub:{fontSize:FontSize.sm,color:Colors.textMuted},
  previewWrap:{marginBottom:Spacing.xl},preview:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.lg,backgroundColor:Colors.card},previewActions:{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.sm},actionBtn:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.card,paddingHorizontal:Spacing.md,paddingVertical:Spacing.sm,borderRadius:BorderRadius.md},actionText:{fontSize:FontSize.xs,color:Colors.text},
  resultCard:{backgroundColor:Colors.card,borderRadius:BorderRadius.lg,padding:Spacing.lg,marginBottom:Spacing.xl,borderWidth:1,borderColor:Colors.success+'40'},resultTitle:{fontSize:FontSize.lg,fontWeight:FontWeight.bold,color:Colors.success,marginBottom:Spacing.md},resultImage:{width:'100%',aspectRatio:1,borderRadius:BorderRadius.md,backgroundColor:Colors.cardLight},resultMeta:{fontSize:FontSize.xs,color:Colors.textMuted,marginTop:Spacing.sm,textAlign:'center'},
  errorCard:{backgroundColor:Colors.error+'15',borderRadius:BorderRadius.md,padding:Spacing.md,flexDirection:'row',alignItems:'center',gap:Spacing.sm,marginBottom:Spacing.xl},errorText:{fontSize:FontSize.sm,color:Colors.error,flex:1},
  descCard:{backgroundColor:Colors.card,borderRadius:BorderRadius.md,padding:Spacing.lg,flexDirection:'row',alignItems:'center',gap:Spacing.md,marginBottom:Spacing['2xl'],borderWidth:1,borderColor:Colors.border},descText:{fontSize:FontSize.base,color:Colors.textSecondary,flex:1,lineHeight:22},
  generateBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:Spacing.sm,backgroundColor:Colors.primary,borderRadius:BorderRadius.xl,paddingVertical:Spacing.base,...Shadow.button},generateBtnDisabled:{opacity:0.5},generateText:{fontSize:FontSize.lg,fontWeight:FontWeight.semibold,color:Colors.text},
});
